export interface KanbanState {
    boards: Board[];
    activeBoardIndex: number;
    selectedTask: Task | null;
    isNewTaskPanelOpen: boolean;
}

export interface Board {
    name:    string;
    columns: Column[];
}

export interface Column {
    name:  string;
    tasks: Task[];
}

export interface Task {
    title:       string;
    description: string;
    status:      Status;
    subtasks:    Subtask[];
}

export enum Status {
    Doing = "Doing",
    Done = "Done",
    Empty = "",
    Todo = "Todo",
}

export interface Subtask {
    title:       string;
    isCompleted: boolean;
}

export type KanbanAction =
  | { type: 'SELECT_BOARD'; payload: number }
  | { type: 'SELECT_TASK'; payload: Task | null }
  | { type: 'TOGGLE_NEW_TASK_PANEL' }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'ADD_TASK'; payload: { columnName: string; task: Task } }
  | { type: 'MOVE_TASK'; payload: { taskTitle: string; fromColumn: string; toColumn: string } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskTitle: string; subtaskTitle: string } }