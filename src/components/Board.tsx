import { useState, useEffect, useRef } from 'react';
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors, useDroppable,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKanban } from '../context/KanbanContext';
import type { Column, Status, Task } from '../types/kanban';

const COLUMN_COLORS = ['#49C4E5', '#8471F2', '#67E2AE', '#F4B550', '#E96E6E'];

const SortableTaskCard = ({ task, columnName, draggingTitle }: { task: Task; columnName: string; draggingTitle: string | null }) => {
  const { dispatch } = useKanban();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.title,
    data: { task, columnName },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: draggingTitle === task.title ? 0.3 : 1 }}
      {...attributes}
      {...listeners}
      onClick={() => draggingTitle !== task.title && dispatch({ type: 'SELECT_TASK', payload: { ...task, status: columnName as Status } })}
      className="bg-white dark:bg-dark-grey rounded-lg p-4 shadow-sm cursor-grab active:cursor-grabbing group touch-none"
    >
      <h3 className="heading-m text-black dark:text-white group-hover:text-main-purple">{task.title}</h3>
      <p className="body-m text-medium-grey mt-2">
        {task.subtasks.filter(s => s.isCompleted).length} of {task.subtasks.length} subtasks
      </p>
    </div>
  );
};

const DroppableColumn = ({ name, tasks, colorIndex, draggingTitle }: { name: string; tasks: Task[]; colorIndex: number; draggingTitle: string | null }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${name}` });

  return (
    <div className="flex flex-col gap-4 w-70 shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLUMN_COLORS[colorIndex % COLUMN_COLORS.length] }} />
        <p className="heading-s">{name.toUpperCase()} ({tasks.length})</p>
      </div>
      <SortableContext items={tasks.map(t => t.title)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-4 flex-1 min-h-20 rounded-md transition-colors ${isOver ? 'bg-main-purple/10' : ''}`}
        >
          {tasks.map(task => (
            <SortableTaskCard key={task.title} task={task} columnName={name} draggingTitle={draggingTitle} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const DragOverlayCard = ({ task }: { task: Task }) => (
  <div className="bg-white dark:bg-dark-grey rounded-lg p-4 shadow-xl w-70 rotate-2 opacity-95 cursor-grabbing">
    <h3 className="heading-m text-black dark:text-white">{task.title}</h3>
    <p className="body-m text-medium-grey mt-2">
      {task.subtasks.filter(s => s.isCompleted).length} of {task.subtasks.length} subtasks
    </p>
  </div>
);

const Board = () => {
  const { state, dispatch } = useKanban();
  const activeBoard = state.boards[state.activeBoardIndex];

  const [localColumns, setLocalColumns] = useState<Column[]>(activeBoard.columns);
  const [draggingTitle, setDraggingTitle] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const localColumnsRef = useRef(localColumns);

  useEffect(() => { localColumnsRef.current = localColumns; }, [localColumns]);

  const displayColumns = draggingTitle ? localColumns : activeBoard.columns;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const findCurrentColumn = (taskTitle: string) =>
    localColumnsRef.current.find(col => col.tasks.some(t => t.title === taskTitle));

  const handleDragStart = ({ active }: DragStartEvent) => {
    setLocalColumns(activeBoard.columns);
    setDraggingTitle(active.id as string);
    setDraggingTask(active.data.current?.task ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeTitle = active.id as string;
    const overId = over.id as string;
    const isOverColumn = overId.startsWith('col:');
    const overColName = isOverColumn ? overId.slice(4) : (over.data.current?.columnName as string | undefined);

    if (!overColName) return;

    const currentCol = findCurrentColumn(activeTitle);
    if (!currentCol) return;

    if (currentCol.name === overColName) {
      if (!isOverColumn) {
        setLocalColumns(prev => prev.map(col => {
          if (col.name !== currentCol.name) return col;
          const oldIdx = col.tasks.findIndex(t => t.title === activeTitle);
          const newIdx = col.tasks.findIndex(t => t.title === overId);
          if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return col;
          return { ...col, tasks: arrayMove(col.tasks, oldIdx, newIdx) };
        }));
      }
    } else {
      setLocalColumns(prev => {
        const task = prev.find(c => c.name === currentCol.name)?.tasks.find(t => t.title === activeTitle);
        if (!task) return prev;
        const updatedTask = { ...task, status: overColName as Status };
        return prev.map(col => {
          if (col.name === currentCol.name) return { ...col, tasks: col.tasks.filter(t => t.title !== activeTitle) };
          if (col.name === overColName) {
            if (isOverColumn) return { ...col, tasks: [...col.tasks, updatedTask] };
            const overIdx = col.tasks.findIndex(t => t.title === overId);
            const next = [...col.tasks];
            next.splice(overIdx >= 0 ? overIdx : next.length, 0, updatedTask);
            return { ...col, tasks: next };
          }
          return col;
        });
      });
    }
  };

  const handleDragEnd = ({ over }: DragEndEvent) => {
    setDraggingTitle(null);
    setDraggingTask(null);
    if (over) dispatch({ type: 'UPDATE_ACTIVE_BOARD_COLUMNS', payload: localColumnsRef.current });
  };

  const handleDragCancel = () => {
    setDraggingTitle(null);
    setDraggingTask(null);
  };

  if (activeBoard.columns.length === 0) {
    return (
      <section className="h-full w-full bg-light-grey dark:bg-very-dark-grey overflow-auto">
        <div className="flex h-full items-center justify-center flex-col gap-6">
          <h2 className="text-medium-grey">This board is empty. Create a new column to get started.</h2>
          <button className="button-primary-l" onClick={() => dispatch({ type: 'TOGGLE_EDIT_BOARD_PANEL' })}>+ Add New Column</button>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full w-full bg-light-grey dark:bg-very-dark-grey overflow-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-6 p-6 min-h-full w-max">
          {displayColumns.map((column, index) => (
            <DroppableColumn
              key={column.name}
              name={column.name}
              tasks={column.tasks}
              colorIndex={index}
              draggingTitle={draggingTitle}
            />
          ))}
          <div className="flex flex-col gap-4 shrink-0">
            <div className="invisible heading-s">placeholder</div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_EDIT_BOARD_PANEL' })}
              className='flex-1 bg-lines-light dark:bg-lines-dark/50 heading-m text-medium-grey rounded-md px-8 flex items-center gap-1 cursor-pointer hover:text-main-purple'
            >
              + New Column
            </button>
          </div>
        </div>
        <DragOverlay>
          {draggingTask && <DragOverlayCard task={draggingTask} />}
        </DragOverlay>
      </DndContext>
    </section>
  );
};

export default Board;
