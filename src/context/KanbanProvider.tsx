import { KanbanContext } from "./KanbanContext";

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  return (
    <KanbanContext.Provider
    value={{}}
    >
        {children}
    </KanbanContext.Provider>
  );
}