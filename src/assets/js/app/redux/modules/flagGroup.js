import {
    Hoisting,
    Side,
    FlagpoleType,
    VerticalHoisting
} from '../../../flagwaver';

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
    hoisting:           Hoisting.DEXTER,
    orientation:        Side.TOP,
    width:              'auto',
    height:             'auto',
    mass:               0.11,
    restDistance:       1.2 / 10,
    src:                '',
    resolution:         256,
    flagpoleType:       FlagpoleType.VERTICAL,
    verticalHoisting:   VerticalHoisting.TOP_RIGHT
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_FLAG_GROUP_OPTIONS:
            return { ...state, ...action.payload };

        default:
            return state;
    }
}
