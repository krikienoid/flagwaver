import {
    Hoisting,
    Side,
    FlagpoleType,
    VerticalHoisting
} from '../../../flagwaver';

// Action types

export const SET_FLAG_GROUP_OPTIONS = 'flagwaver/flagGroup/SET_FLAG_GROUP_OPTIONS';

// Action creators

export const setFlagGroupOptions = (value) => ({
    type: SET_FLAG_GROUP_OPTIONS,
    payload: value
});

// Reducer

const initialState = {
    // UI
    imageSrc:                   '',
    backSideImageSrc:           '',
    isTwoSided:                 false,

    // Texture
    width:                      'auto',
    height:                     'auto',
    hoisting:                   Hoisting.DEXTER,
    orientation:                Side.TOP,
    resolution:                 256,

    // Flag
    mass:                       0.11,
    restDistance:               1.2 / 10,

    // Flagpole
    flagpoleType:               FlagpoleType.VERTICAL,
    verticalHoisting:           VerticalHoisting.TOP_RIGHT
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_FLAG_GROUP_OPTIONS:
            const newState = { ...state, ...action.payload };

            if (!newState.imageSrc) {
                newState.isTwoSided = false;
            }

            if (!newState.isTwoSided) {
                newState.backSideImageSrc = '';
            }

            return newState;

        default:
            return state;
    }
}
