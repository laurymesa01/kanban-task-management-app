import type { KanbanAction, KanbanState, Task } from "../types/kanban";

export function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
    const activeBoard = state.boards[state.activeBoardIndex];

    switch (action.type) {

        case 'SELECT_BOARD':
            return { ...state, activeBoardIndex: action.payload, selectedTask: null, isNewTaskPanelOpen: false, isEditTaskPanelOpen: false, isDeleteTaskPanelOpen: false }

        case 'SELECT_TASK':
            return { ...state, selectedTask: action.payload }

        case 'TOGGLE_NEW_TASK_PANEL':
            return { ...state, isNewTaskPanelOpen: !state.isNewTaskPanelOpen }

        case 'TOGGLE_NEW_BOARD_PANEL':
            return { ...state, isNewBoardPanelOpen: !state.isNewBoardPanelOpen, selectedTask: !state.isNewBoardPanelOpen ? null : state.selectedTask }

        case 'TOGGLE_DELETE_BOARD_PANEL':
            return { ...state, isDeleteBoardPanelOpen: !state.isDeleteBoardPanelOpen, selectedTask: !state.isDeleteBoardPanelOpen ? null : state.selectedTask }

        case 'TOGGLE_DELETE_TASK_PANEL':
            return { ...state, isDeleteTaskPanelOpen: !state.isDeleteTaskPanelOpen }

        case 'ADD_BOARD':
            return {
                ...state,
                boards: [...state.boards, action.payload],
                activeBoardIndex: state.boards.length,
                isNewBoardPanelOpen: false,
            }

        case 'DELETE_BOARD': {
            const updatedBoards = state.boards.filter((_, i) => i !== state.activeBoardIndex);
            const newIndex = Math.min(state.activeBoardIndex, updatedBoards.length - 1);
            return {
                ...state,
                boards: updatedBoards,
                activeBoardIndex: Math.max(0, newIndex),
                isDeleteBoardPanelOpen: false,
            };
        }

        case 'TOGGLE_EDIT_BOARD_PANEL':
            return { ...state, isEditBoardPanelOpen: !state.isEditBoardPanelOpen, selectedTask: !state.isEditBoardPanelOpen ? null : state.selectedTask }

        case 'EDIT_BOARD': {
            const updatedColumns = action.payload.columns.map(newCol => {
                const existing = activeBoard.columns.find(c => c.name === newCol.name);
                return existing ?? newCol;
            });
            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex
                    ? { ...action.payload, columns: updatedColumns }
                    : board
            );
            return { ...state, boards: updatedBoards, isEditBoardPanelOpen: false };
        }

        case 'MOVE_TASK': {
            const { taskId, fromColumn, toColumn } = action.payload;

            const taskToMove = activeBoard.columns
                .find(col => col.name === fromColumn)
                ?.tasks.find(t => t.id === taskId);

            if (!taskToMove) return state;

            const updatedTask = { ...taskToMove, status: toColumn };

            const updatedColumns = activeBoard.columns.map(col => {
                if (col.name === fromColumn) return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
                if (col.name === toColumn) return { ...col, tasks: [...col.tasks, updatedTask] };
                return col;
            });

            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            );

            return { ...state, boards: updatedBoards, selectedTask: updatedTask };
        }

        case 'ADD_TASK': {
            const { columnName, task } = action.payload;
            const newTask: Task = { ...task, id: crypto.randomUUID() };
            const updatedColumns = activeBoard.columns.map(col =>
                col.name === columnName ? { ...col, tasks: [...col.tasks, newTask] } : col
            );
            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            );
            return { ...state, boards: updatedBoards, isNewTaskPanelOpen: false };
        }

        case 'TOGGLE_EDIT_TASK_PANEL':
            return { ...state, isEditTaskPanelOpen: !state.isEditTaskPanelOpen, selectedTask: state.isEditTaskPanelOpen ? null : state.selectedTask }

        case 'EDIT_TASK': {
            const { originalId, originalStatus, task } = action.payload;

            const originalTask = activeBoard.columns
                .find(col => col.name === originalStatus)
                ?.tasks.find(t => t.id === originalId);

            const updatedTask: Task = {
                ...task,
                id: originalId,
                subtasks: task.subtasks.map(s => {
                    const existing = originalTask?.subtasks.find(os => os.title === s.title);
                    return existing ? { ...s, isCompleted: existing.isCompleted } : s;
                }),
            };

            const updatedColumns = activeBoard.columns.map(col => {
                if (col.name === originalStatus && col.name === updatedTask.status) {
                    return { ...col, tasks: col.tasks.map(t => t.id === originalId ? updatedTask : t) };
                }
                if (col.name === originalStatus) {
                    return { ...col, tasks: col.tasks.filter(t => t.id !== originalId) };
                }
                if (col.name === updatedTask.status) {
                    return { ...col, tasks: [...col.tasks, updatedTask] };
                }
                return col;
            });

            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            );

            return { ...state, boards: updatedBoards, selectedTask: updatedTask, isEditTaskPanelOpen: false };
        }

        case 'DELETE_TASK': {
            const task = state.selectedTask;
            if (!task) return state;

            const updatedColumns = activeBoard.columns.map(col =>
                col.name === task.status ? { ...col, tasks: col.tasks.filter(t => t.id !== task.id) } : col
            );

            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            );

            return { ...state, boards: updatedBoards, selectedTask: null, isDeleteTaskPanelOpen: false };
        }

        case 'TOGGLE_SUBTASK': {
            const { taskId, subtaskTitle } = action.payload;

            let updatedTask: Task | null = null;

            const updatedColumns = activeBoard.columns.map(col => ({
                ...col,
                tasks: col.tasks.map(t => {
                    if (t.id !== taskId) return t;
                    updatedTask = {
                        ...t,
                        subtasks: t.subtasks.map(s =>
                            s.title === subtaskTitle ? { ...s, isCompleted: !s.isCompleted } : s
                        ),
                    };
                    return updatedTask;
                }),
            }));

            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            );

            return { ...state, boards: updatedBoards, selectedTask: updatedTask ?? state.selectedTask };
        }

        case 'UPDATE_ACTIVE_BOARD_COLUMNS': {
            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: action.payload } : board
            );
            return { ...state, boards: updatedBoards };
        }

        default:
            return state;
    }
}
