// Action Types

export const SET_FILE_RECORD = 'flagwaver/fileRecord/SET_FILE_RECORD';

// Action Creators

export function setFileRecord(value) {
    return {
        type: SET_FILE_RECORD,
        payload: value
    };
}

// Reducer

const initialState = {
    url: '',
    file: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_FILE_RECORD:
            return action.payload;

        default:
            return state;
    }
}
