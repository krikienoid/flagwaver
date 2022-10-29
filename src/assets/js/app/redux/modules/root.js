import { combineReducers } from 'redux';

import animationControl from './animationControl';
import toasts from './toasts';

import flagGroup from './flagGroup';
import scenery from './scenery';
import wind from './wind';

// Action types

export const RESET_APP = 'flagwaver/root/RESET_APP';

// Action creators

export const resetApp = () => ({
    type: RESET_APP
});

// Reducer

const appReducer = combineReducers({
    animationControl: animationControl,
    toasts: toasts,
    flagGroup: flagGroup,
    scenery: scenery,
    wind: wind
});

export default function rootReducer(state, action) {
    if (action.type === RESET_APP) {
        return appReducer(undefined, action);
    }

    return appReducer(state, action);
}
