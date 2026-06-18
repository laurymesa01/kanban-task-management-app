import { useState, useRef } from 'react';
import {
  PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Board, Column, KanbanAction, Status, Task } from '../types/kanban';
import type { Dispatch } from 'react';

export function useBoardDnd(activeBoard: Board, dispatch: Dispatch<KanbanAction>) {
  const [localColumns, setLocalColumns] = useState<Column[]>(activeBoard.columns);
  const [draggingTitle, setDraggingTitle] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const localColumnsRef = useRef(localColumns);

  const displayColumns = draggingTitle ? localColumns : activeBoard.columns;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const findCurrentColumn = (taskTitle: string) =>
    localColumnsRef.current.find(col => col.tasks.some(t => t.title === taskTitle));

  // Updates state and ref atomically inside the functional updater so
  // localColumnsRef.current is never stale when handleDragEnd reads it.
  const setColumns = (updater: (prev: Column[]) => Column[]) => {
    setLocalColumns(prev => {
      const next = updater(prev);
      localColumnsRef.current = next;
      return next;
    });
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    localColumnsRef.current = activeBoard.columns;
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
        setColumns(prev => prev.map(col => {
          if (col.name !== currentCol.name) return col;
          const oldIdx = col.tasks.findIndex(t => t.title === activeTitle);
          const newIdx = col.tasks.findIndex(t => t.title === overId);
          if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return col;
          return { ...col, tasks: arrayMove(col.tasks, oldIdx, newIdx) };
        }));
      }
    } else {
      setColumns(prev => {
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

  return { displayColumns, draggingTitle, draggingTask, sensors, handleDragStart, handleDragOver, handleDragEnd, handleDragCancel };
}
