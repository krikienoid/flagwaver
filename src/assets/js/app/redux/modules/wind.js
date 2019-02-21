// Action Types

export const SET_WIND_OPTIONS = 'flagwaver/wind/SET_WIND_OPTIONS';

// Action Creators

export function setWindOptions(value) {
    return {
        type: SET_WIND_OPTIONS,
        payload: value
    };
}

// Reducer

const initialState = {
    enabled: true,
    speed: 200
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_WIND_OPTIONS:
            return { ...state, ...action.payload };

        default:
            return state;
    }
}
