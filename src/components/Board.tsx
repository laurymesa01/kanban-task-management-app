import {
  DndContext, DragOverlay, closestCorners, useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKanban } from '../context/KanbanContext';
import { useBoardDnd } from '../hooks/useBoardDnd';
import type { KanbanAction, Task } from '../types/kanban';
import type { Dispatch } from 'react';

const COLUMN_COLORS = ['#49C4E5', '#8471F2', '#67E2AE', '#F4B550', '#E96E6E'];

const SortableTaskCard = ({ task, columnName, draggingId, onSelect }: {
  task: Task;
  columnName: string;
  draggingId: string | null;
  onSelect: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: { task, columnName },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: draggingId === task.id ? 0.3 : 1 }}
      {...attributes}
      {...listeners}
      onClick={() => draggingId !== task.id && onSelect()}
      className="bg-white dark:bg-dark-grey rounded-lg p-4 shadow-sm cursor-grab active:cursor-grabbing group touch-none"
    >
      <span className="heading-m text-black dark:text-white group-hover:text-main-purple block">{task.title}</span>
      <p className="body-m text-medium-grey mt-2">
        {task.subtasks.filter(s => s.isCompleted).length} of {task.subtasks.length} subtasks
      </p>
    </div>
  );
};

const DroppableColumn = ({ name, tasks, colorIndex, draggingId, dispatch }: {
  name: string;
  tasks: Task[];
  colorIndex: number;
  draggingId: string | null;
  dispatch: Dispatch<KanbanAction>;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${name}` });

  return (
    <div className="flex flex-col gap-4 w-70 shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLUMN_COLORS[colorIndex % COLUMN_COLORS.length] }} />
        <h2 className="heading-s">{name.toUpperCase()} ({tasks.length})</h2>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-4 flex-1 min-h-20 rounded-md transition-colors ${isOver ? 'bg-main-purple/10' : ''}`}
        >
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              columnName={name}
              draggingId={draggingId}
              onSelect={() => dispatch({ type: 'SELECT_TASK', payload: { ...task, status: name } })}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const DragOverlayCard = ({ task }: { task: Task }) => (
  <div className="bg-white dark:bg-dark-grey rounded-lg p-4 shadow-xl w-70 rotate-2 opacity-95 cursor-grabbing">
    <span className="heading-m text-black dark:text-white block">{task.title}</span>
    <p className="body-m text-medium-grey mt-2">
      {task.subtasks.filter(s => s.isCompleted).length} of {task.subtasks.length} subtasks
    </p>
  </div>
);

const Board = () => {
  const { state, dispatch } = useKanban();
  const activeBoard = state.boards[state.activeBoardIndex];
  const { displayColumns, draggingId, draggingTask, sensors, handleDragStart, handleDragOver, handleDragEnd, handleDragCancel } = useBoardDnd(activeBoard, dispatch);

  if (activeBoard.columns.length === 0) {
    return (
      <main className="h-full w-full bg-light-grey dark:bg-very-dark-grey overflow-auto">
        <div className="flex h-full items-center mx-4 justify-center flex-col gap-6">
          <h2 className="heading-l text-medium-grey text-center">This board is empty. Create a new column to get started.</h2>
          <button className="button-primary-l" onClick={() => dispatch({ type: 'TOGGLE_EDIT_BOARD_PANEL' })}>+ Add New Column</button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full bg-light-grey dark:bg-very-dark-grey overflow-auto">
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
              draggingId={draggingId}
              dispatch={dispatch}
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
    </main>
  );
};

export default Board;
