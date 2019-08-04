// Action Types

export const ADD_TOAST = 'flagwaver/toasts/ADD_TOAST';
export const REMOVE_TOAST = 'flagwaver/toasts/REMOVE_TOAST';

// Operations

let id = 0;

const defaultOptions = {
    status: 'default',
    message: ''
};

export function createToast(options) {
    return {
        ...defaultOptions,
        ...options,
        id: id++
    };
}

// Action Creators

export function addToast(options = {}) {
    return {
        type: ADD_TOAST,
        payload: createToast(options)
    };
}

export function removeToast(id) {
    return {
        type: REMOVE_TOAST,
        payload: id
    };
}

// Reducer

export default function reducer(state = [], action) {
    switch (action.type) {
        case ADD_TOAST:
            return [action.payload, ...state];

        case REMOVE_TOAST:
            return state.filter(toast => toast.id !== action.payload);

        default:
            return state;
    }
}
