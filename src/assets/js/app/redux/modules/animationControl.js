// Action Types

export const SET_PAUSED = 'flagwaver/animationControl/SET_PAUSED';

// Action Creators

export function setPaused(value) {
    return {
        type: SET_PAUSED,
        payload: value
    };
}

// Reducer

const initialState = {
    paused: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PAUSED:
            return { ...state, paused: action.payload };

        default:
            return state;
    }
}
