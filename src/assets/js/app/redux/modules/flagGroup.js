// Action Types

export const SET_FLAG_GROUP_OPTIONS = 'flagwaver/flagGroup/SET_FLAG_GROUP_OPTIONS';

// Action Creators

export function setFlagGroupOptions(options) {
    return {
        type: SET_FLAG_GROUP_OPTIONS,
        payload: options
    };
}

// Reducer

const initialState = {
    topEdge:        'top',
    hoisting:       'dexter',
    width:          'auto',
    height:         'auto',
    mass:           0.1,
    granularity:    10,
    imageSrc:       '',
    flagpoleType:   'vertical'
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_FLAG_GROUP_OPTIONS:
            return { ...state, ...action.payload };

        default:
            return state;
    }
}
