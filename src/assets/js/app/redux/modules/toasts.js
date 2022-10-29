// Action types

export const ADD_TOAST = 'flagwaver/toasts/ADD_TOAST';
export const REMOVE_TOAST = 'flagwaver/toasts/REMOVE_TOAST';

// Operations

let id = 0;

const defaultOptions = {
    status: 'default',
    message: ''
};

// Action creators

export const addToast = (options = {}) => ({
    type: ADD_TOAST,
    payload: {
        ...defaultOptions,
        ...options,
        id: id++
    }
});

export const removeToast = (id) => ({
    type: REMOVE_TOAST,
    payload: id
});

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
