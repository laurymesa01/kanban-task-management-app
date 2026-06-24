import { createContext, useContext } from "react";
import data from '../../data.json';
import type { KanbanState, KanbanAction, Board, Task } from '../types/kanban';

function assignTaskIds(boards: typeof data.boards): Board[] {
  return boards.map(board => ({
    ...board,
    columns: board.columns.map(col => ({
      ...col,
      tasks: col.tasks.map(task => ({
        ...task,
        id: crypto.randomUUID(),
      })) as Task[],
    })),
  })) as Board[];
}

export const initialState: KanbanState = {
    boards: assignTaskIds(data.boards),
    activeBoardIndex: 0,
    selectedTask: null,
    isNewTaskPanelOpen: false,
    isNewBoardPanelOpen: false,
    isDeleteBoardPanelOpen: false,
    isDeleteTaskPanelOpen: false,
    isEditBoardPanelOpen: false,
    isEditTaskPanelOpen: false,
  }

export const KanbanContext = createContext<{
  state: KanbanState
  dispatch: React.Dispatch<KanbanAction>
} | null>(null)

export function useKanban() {
  const ctx = useContext(KanbanContext)
  if (!ctx) throw new Error('useKanban must be used inside KanbanProvider')
  return ctx
}
