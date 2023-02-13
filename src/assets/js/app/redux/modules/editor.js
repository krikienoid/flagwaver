import { combineReducers } from 'redux';

import { revokeObjectURL } from '../../utils/BlobUtils';
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

function withObjectURLCleaner(reducer) {
    const mapStateToURLs = state => [
        state.flagGroup.imageSrc,
        state.flagGroup.backSideImageSrc,
        state.scenery.backgroundImageSrc
    ];

    const cleanObjectURLs = (state, newState) => {
        const history = [
            ...state.past,
            state.present,
            ...state.future
        ];

        const newHistory = [
            ...newState.past,
            newState.present,
            ...newState.future
        ];

        const detachedStates = history
            .filter(a => !newHistory.some(b => b === a));

        const activeURLs = newHistory
            .map(mapStateToURLs)
            .flat();

        const detachedURLs = detachedStates
            .map(mapStateToURLs)
            .flat()
            .filter(url => !activeURLs.includes(url));

        detachedURLs.map((url) => {
            revokeObjectURL(url);
        });
    };

    return function (state, action) {
        const newState = reducer(state, action);

        if (state && action.type !== UNDO && action.type !== REDO) {
            cleanObjectURLs(state, newState);
        }

        return newState;
    };
}

const combinedReducer = withObjectURLCleaner(undoable(combineReducers({
    flagGroup,
    scenery,
    wind
}), {
    limit: 20,
    undoType: UNDO,
    redoType: REDO,
    clearHistoryType: CLEAR_HISTORY
}));

export default function reducer(state, action) {
    switch (action.type) {
        case RESET_APP:
            return combinedReducer(undefined, action);

        default:
            return combinedReducer(state, action);
    }
}
