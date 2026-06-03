import { useReducer } from "react";
import { KanbanContext, initialState } from "./KanbanContext";
import { kanbanReducer } from "./kanbanReducer";

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}