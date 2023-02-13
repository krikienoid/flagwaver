// Action types

export const UNDO = 'flagwaver/undoable/UNDO';
export const REDO = 'flagwaver/undoable/REDO';
export const CLEAR_HISTORY = 'flagwaver/undoable/CLEAR_HISTORY';

// Reducer enhancer

export default function undoable(reducer, {
    limit = 50,
    undoType = UNDO,
    redoType = REDO,
    clearHistoryType = CLEAR_HISTORY
}) {
    const initialState = {
        past: [],
        present: reducer(undefined, {}),
        future: []
    };

    return function (state = initialState, action) {
        const { past, present, future } = state;

        switch (action.type) {
            case undoType:
                return {
                    past: past.slice(0, past.length - 1),
                    present: past[past.length - 1],
                    future: [present, ...future]
                };

            case redoType:
                return {
                    past: [...past, present],
                    present: future[0],
                    future: future.slice(1)
                };

            case clearHistoryType:
                return {
                    past: [],
                    present: present,
                    future: []
                };

            default: {
                const newPresent = reducer(present, action);

                if (present === newPresent) {
                    return state;
                }

                return {
                    past: [...past, present].slice(-limit),
                    present: newPresent,
                    future: []
                };
            }
        }
    };
}
