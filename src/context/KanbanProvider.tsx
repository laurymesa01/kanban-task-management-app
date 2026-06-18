import { useReducer, useEffect } from "react";
import { KanbanContext, initialState } from "./KanbanContext";
import { kanbanReducer } from "./kanbanReducer";
import type { KanbanState } from "../types/kanban";

function loadState(): KanbanState {
  try {
    const saved = localStorage.getItem('kanbanState');
    if (saved) {
      const parsed = JSON.parse(saved);
      const boards = Array.isArray(parsed.boards) ? parsed.boards : initialState.boards;
      const activeBoardIndex =
        typeof parsed.activeBoardIndex === 'number' &&
        parsed.activeBoardIndex >= 0 &&
        parsed.activeBoardIndex < boards.length
          ? parsed.activeBoardIndex
          : 0;
      return { ...initialState, boards, activeBoardIndex };
    }
  } catch {
    // ignore corrupted data
  }
  return initialState;
}

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('kanbanState', JSON.stringify({
      boards: state.boards,
      activeBoardIndex: state.activeBoardIndex,
    }));
  }, [state.boards, state.activeBoardIndex]);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}
