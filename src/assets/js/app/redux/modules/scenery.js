import { SceneryBackground } from '../../constants';

// Action types

export const SET_SCENERY_OPTIONS = 'flagwaver/scenery/SET_SCENERY_OPTIONS';

// Action creators

export const setSceneryOptions = (value) => ({
    type: SET_SCENERY_OPTIONS,
    payload: value
});

// Reducer

const initialState = {
    background:                 SceneryBackground.CLASSIC,
    backgroundColor:            '#000000',
    backgroundImageSrc:         ''
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SCENERY_OPTIONS:
            return { ...state, ...action.payload };

        default:
            return state;
    }
}
