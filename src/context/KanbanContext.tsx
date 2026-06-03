import { createContext, useContext } from "react";
import data from '../../data.json';
import type { KanbanState, KanbanAction, Board } from '../types/kanban';

export const initialState: KanbanState = {
    boards: data.boards as Board[],
    activeBoardIndex: 0,
    selectedTask: null,
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

