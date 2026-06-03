import type { KanbanAction, KanbanState } from "../types/kanban";

export function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
    switch (action.type) {
        case 'SELECT_BOARD': 
            return { ...state, activeBoardIndex: action.payload }
        default:
            return state;
    }
}   