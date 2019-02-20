import { setFileRecord } from '../redux/modules/fileRecord';
import flagGroup, { setFlagGroupOptions } from '../redux/modules/flagGroup';
import HashState from '../helpers/HashState';

const flagGroupDefaults = flagGroup(undefined, {});

const hashState = new HashState({
    'src': {
        defaultValue: flagGroupDefaults.imgSrc,
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
    'topedge': {
        defaultValue: flagGroupDefaults.topEdge,
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
        src: state.flagGroup.imgSrc,
        hoisting: state.flagGroup.hoisting,
        topedge: state.flagGroup.topEdge
    };
}

function mapStateFromHash(state) {
    return {
        fileRecord: {
            url: state.src,
            file: null
        },
        flagGroup: assignDefaults(flagGroupDefaults, {
            imgSrc: state.src,
            hoisting: state.hoisting,
            topEdge: state.topedge
        })
    };
}

function isValidState(state) {
    // Has an image and is not a local file
    return !!state.flagGroup.imgSrc && !state.fileRecord.file;
}

function withLegacyFallback(state) {
    // Backwards compatibility for old link structure
    if (!state.src) {
        return {
            src: window.unescape(window.location.hash.slice(1))
        };
    }

    return state;
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
    const state = mapStateFromHash(withLegacyFallback(hashState.getState()));

    store.dispatch(setFileRecord(state.fileRecord));
    store.dispatch(setFlagGroupOptions(state.flagGroup));
}
