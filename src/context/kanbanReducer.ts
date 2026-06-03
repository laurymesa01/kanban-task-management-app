import type { KanbanAction, KanbanState } from "../types/kanban";
import { Status } from "../types/kanban";

export function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
    switch (action.type) {
        case 'SELECT_BOARD': 
            return { ...state, activeBoardIndex: action.payload }

        case 'SELECT_TASK':
            return { ...state, selectedTask: action.payload }

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

        default:
            return state;
    }
}   