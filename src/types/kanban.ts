export interface KanbanState {
    boards: Board[];
    activeBoardIndex: number;
    selectedTask: Task | null;
    isNewTaskPanelOpen: boolean;
    isNewBoardPanelOpen: boolean;
    isDeleteBoardPanelOpen: boolean;
    isDeleteTaskPanelOpen: boolean;
    isEditBoardPanelOpen: boolean;
    isEditTaskPanelOpen: boolean;
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
    id:          string;
    title:       string;
    description: string;
    status:      string;
    subtasks:    Subtask[];
}

export interface Subtask {
    title:       string;
    isCompleted: boolean;
}

export type KanbanAction =
  | { type: 'SELECT_BOARD'; payload: number }
  | { type: 'SELECT_TASK'; payload: Task | null }
  | { type: 'TOGGLE_NEW_TASK_PANEL' }
  | { type: 'TOGGLE_NEW_BOARD_PANEL' }
  | { type: 'TOGGLE_DELETE_BOARD_PANEL' }
  | { type: 'TOGGLE_DELETE_TASK_PANEL' }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'EDIT_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD' }
  | { type: 'TOGGLE_EDIT_BOARD_PANEL' }
  | { type: 'ADD_TASK'; payload: { columnName: string; task: Omit<Task, 'id'> } }
  | { type: 'TOGGLE_EDIT_TASK_PANEL' }
  | { type: 'EDIT_TASK'; payload: { originalId: string; originalStatus: string; task: Omit<Task, 'id'> } }
  | { type: 'DELETE_TASK' }
  | { type: 'MOVE_TASK'; payload: { taskId: string; fromColumn: string; toColumn: string } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subtaskTitle: string } }
  | { type: 'UPDATE_ACTIVE_BOARD_COLUMNS'; payload: Column[] }
