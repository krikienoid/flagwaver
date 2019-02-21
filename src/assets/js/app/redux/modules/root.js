import { combineReducers } from 'redux';

import fileRecord from './fileRecord';
import flagGroup from './flagGroup';
import wind from './wind';

// Action Types

export const RESET_APP = 'flagwaver/root/RESET_APP';

// Action Creators

export function resetApp() {
    return {
        type: RESET_APP
    };
}

// Reducer

const appReducer = combineReducers({
    fileRecord: fileRecord,
    flagGroup: flagGroup,
    wind: wind
});

export default function rootReducer(state, action) {
    if (action.type === RESET_APP) {
        return appReducer(undefined, action);
    }

    return appReducer(state, action);
}
