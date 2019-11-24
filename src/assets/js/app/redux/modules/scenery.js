import { SceneryBackground } from '../../constants';

// Action Types

export const SET_SCENERY_OPTIONS = 'flagwaver/scenery/SET_SCENERY_OPTIONS';

// Action Creators

export function setSceneryOptions(value) {
    return {
        type: SET_SCENERY_OPTIONS,
        payload: value
    };
}

// Reducer

const initialState = {
    background: SceneryBackground.CLASSIC
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SCENERY_OPTIONS:
            return { ...state, ...action.payload };

        default:
            return state;
    }
}
