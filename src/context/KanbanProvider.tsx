import { useReducer, useEffect } from "react";
import { KanbanContext, initialState } from "./KanbanContext";
import { kanbanReducer } from "./kanbanReducer";
import type { KanbanState } from "../types/kanban";

function loadState(): KanbanState {
  try {
    const saved = localStorage.getItem('kanbanState');
    if (saved) {
      const { boards, activeBoardIndex } = JSON.parse(saved);
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
