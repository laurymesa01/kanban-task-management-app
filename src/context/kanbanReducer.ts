import type { KanbanAction, KanbanState, Task } from "../types/kanban";
import { Status } from "../types/kanban";

export function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
    switch (action.type) {
        
        case 'SELECT_BOARD': 
            return { ...state, activeBoardIndex: action.payload }

        case 'SELECT_TASK':
            return { ...state, selectedTask: action.payload }

        case 'TOGGLE_NEW_TASK_PANEL':
            return { ...state, isNewTaskPanelOpen: !state.isNewTaskPanelOpen }

        case 'TOGGLE_NEW_BOARD_PANEL':
                return { ...state, isNewBoardPanelOpen: !state.isNewBoardPanelOpen }

        case 'TOGGLE_DELETE_BOARD_PANEL':
                return { ...state, isDeleteBoardPanelOpen: !state.isDeleteBoardPanelOpen }

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
            return { ...state, isEditBoardPanelOpen: !state.isEditBoardPanelOpen }

        case 'EDIT_BOARD': {
            const currentBoard = state.boards[state.activeBoardIndex];
            const updatedColumns = action.payload.columns.map(newCol => {
                const existing = currentBoard.columns.find(c => c.name === newCol.name);
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
            const { taskTitle, fromColumn, toColumn } = action.payload
            const activeBoard = state.boards[state.activeBoardIndex]

            const taskToMove = activeBoard.columns
                .find(col => col.name === fromColumn)
                ?.tasks.find(t => t.title === taskTitle)

            if (!taskToMove) return state

            const updatedTask = { ...taskToMove, status: toColumn as Status }

            const updatedColumns = activeBoard.columns.map(col => {
                if (col.name === fromColumn) return { ...col, tasks: col.tasks.filter(t => t.title !== taskTitle) }
                if (col.name === toColumn) return { ...col, tasks: [...col.tasks, updatedTask] }
                return col
            })

            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            )

            return { ...state, boards: updatedBoards, selectedTask: updatedTask }
        }

        case 'ADD_TASK': {
            const { columnName, task } = action.payload
            const updatedColumns = state.boards[state.activeBoardIndex].columns.map(col =>
                col.name === columnName ? { ...col, tasks: [...col.tasks, task] } : col
            )
            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            )
            return { ...state, boards: updatedBoards, isNewTaskPanelOpen: false }
        }

        case 'TOGGLE_SUBTASK': {
            const { taskTitle, subtaskTitle } = action.payload
            const activeBoard = state.boards[state.activeBoardIndex]

            let updatedTask: Task | null = null

            const updatedColumns = activeBoard.columns.map(col => ({
                ...col,
                tasks: col.tasks.map(t => {
                    if (t.title !== taskTitle) return t
                    updatedTask = {
                        ...t,
                        subtasks: t.subtasks.map(s =>
                            s.title === subtaskTitle ? { ...s, isCompleted: !s.isCompleted } : s
                        ),
                    }
                    return updatedTask
                }),
            }))

            const updatedBoards = state.boards.map((board, i) =>
                i === state.activeBoardIndex ? { ...board, columns: updatedColumns } : board
            )

            return { ...state, boards: updatedBoards, selectedTask: updatedTask ?? state.selectedTask }
        }

        default:
            return state;
    }
}   