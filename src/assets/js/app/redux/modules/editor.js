import { combineReducers } from 'redux';

import flagGroup from './flagGroup';
import scenery from './scenery';
import undoable from './undoable';
import wind from './wind';

// Action types

export const RESET_APP = 'flagwaver/editor/RESET_APP';
export const UNDO = 'flagwaver/editor/UNDO';
export const REDO = 'flagwaver/editor/REDO';
export const CLEAR_HISTORY = 'flagwaver/editor/CLEAR_HISTORY';

// Action creators

export const resetApp = () => ({
    type: RESET_APP
});

export const undo = () => ({
    type: UNDO
});

export const redo = () => ({
    type: REDO
});

export const clearHistory = () => ({
    type: CLEAR_HISTORY
});

// Reducer

const combinedReducer = undoable(combineReducers({
    flagGroup,
    scenery,
    wind
}), {
    limit: 20,
    undoType: UNDO,
    redoType: REDO,
    clearHistoryType: CLEAR_HISTORY
});

export default function reducer(state, action) {
    switch (action.type) {
        case RESET_APP:
            return combinedReducer(undefined, action);

        default:
            return combinedReducer(state, action);
    }
}
