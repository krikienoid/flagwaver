// Action Types

export const SET_MUTED = 'flagwaver/animationControl/SET_MUTED';
export const SET_PAUSED = 'flagwaver/animationControl/SET_PAUSED';

// Action Creators

export function setMuted(value) {
    return {
        type: SET_MUTED,
        payload: value
    };
}

export function setPaused(value) {
    return {
        type: SET_PAUSED,
        payload: value
    };
}

// Reducer

const initialState = {
    muted: false,
    paused: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_MUTED:
            return { ...state, muted: action.payload };

        case SET_PAUSED:
            return { ...state, paused: action.payload };

        default:
            return state;
    }
}
