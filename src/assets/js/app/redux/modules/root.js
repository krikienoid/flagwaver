import { combineReducers } from 'redux';

import animationControl from './animationControl';
import editor from './editor';
import toasts from './toasts';

// Reducer

const rootReducer = combineReducers({
    animationControl,
    editor,
    toasts
});

export default rootReducer;
