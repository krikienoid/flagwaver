import HashState from '../../hashstate';
import { setFileRecord } from '../redux/modules/fileRecord';
import flagGroup, { setFlagGroupOptions } from '../redux/modules/flagGroup';

const flagGroupDefaults = flagGroup(undefined, {});

const hashState = new HashState({
    'src': {
        defaultValue: flagGroupDefaults.imageSrc,
        parse: value => decodeURIComponent(value),
        stringify: value => encodeURIComponent(value)
    },
    'hoisting': {
        defaultValue: flagGroupDefaults.hoisting,
        parse: (string) => {
            if (string.match(/^dex(ter)?$/gi)) {
                return 'dexter';
            } else if (string.match(/^sin(ister)?$/gi)) {
                return 'sinister';
            }
        },
        stringify: value => 'sin'
    },
    'orientation': {
        defaultValue: flagGroupDefaults.orientation,
        parse: (string) => {
            if (string.match(/^(top|right|bottom|left)$/gi)) {
                return string.toLowerCase();
            }
        }
    }
});

function assignDefaults(defaults, options) {
    return Object.keys(defaults).reduce((result, key) => {
        const value = options[key];

        result[key] = (value != null) ? value : defaults[key];

        return result;
    }, {});
}

function mapStateToHash(state) {
    return {
        src: state.flagGroup.imageSrc,
        hoisting: state.flagGroup.hoisting,
        orientation: state.flagGroup.orientation
    };
}

function mapStateFromHash(state) {
    return {
        fileRecord: {
            url: state.src,
            file: null
        },
        flagGroup: assignDefaults(flagGroupDefaults, {
            imageSrc: state.src,
            hoisting: state.hoisting,
            orientation: state.orientation
        })
    };
}

function isValidState(state) {
    return (
        // Has an image
        !!state.flagGroup.imageSrc &&
        // Not a local file
        !state.fileRecord.file &&
        // File selection has been applied to flag
        state.fileRecord.url === state.flagGroup.imageSrc
    );
}

function withLegacyFallbackSrc(state) {
    // Backwards compatibility for old link structure
    if (!state.src) {
        return {
            ...state,
            src: window.unescape(window.location.hash.slice(1))
        };
    }

    return state;
}

function withLegacyFallbackTopEdge(state) {
    // Backwards compatibility for old topedge param
    if (state.topedge && state.orientation === flagGroupDefaults.orientation) {
        return {
            ...state,
            orientation: state.topedge
        };
    }

    return state;
}

function withLegacyFallbacks(state) {
    return [
        withLegacyFallbackSrc,
        withLegacyFallbackTopEdge
    ].reduce((result, fn) => fn(result), state);
}

export function toHash(store) {
    const state = store.getState();

    if (isValidState(state)) {
        hashState.setState(mapStateToHash(state));
    } else {
        hashState.setState(null);
    }
}

export function fromHash(store) {
    const state = mapStateFromHash(withLegacyFallbacks(hashState.getState()));

    store.dispatch(setFileRecord(state.fileRecord));
    store.dispatch(setFlagGroupOptions(state.flagGroup));
}
