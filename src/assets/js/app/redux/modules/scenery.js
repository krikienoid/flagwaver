import { SceneryBackground } from '../../constants';
import fileRecord, { setFileRecord } from './fileRecord';

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
    background: SceneryBackground.CLASSIC,
    backgroundColor: '#000000',
    backgroundImage: fileRecord(undefined, {})
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SCENERY_OPTIONS:
            const { backgroundImage } = action.payload;

            if (backgroundImage) {
                action.payload.backgroundImage = fileRecord(
                    state.backgroundImage,
                    setFileRecord(backgroundImage)
                );
            }

            return { ...state, ...action.payload };

        default:
            return state;
    }
}
