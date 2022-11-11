import {
    Hoisting,
    Side,
    FlagpoleType,
    VerticalHoisting
} from '../../flagwaver';
import HashState from '../../hashstate';
import { SceneryBackground } from '../constants';
import { clearHistory } from '../redux/modules/editor';
import flagGroup, { setFlagGroupOptions } from '../redux/modules/flagGroup';
import scenery, { setSceneryOptions } from '../redux/modules/scenery';
import { getObject } from '../utils/BlobUtils';
import { isColorHex } from '../utils/Validators';

const flagGroupDefaults = flagGroup(undefined, {});
const sceneryDefaults = scenery(undefined, {});

function parseEnumValue(enumObject, string) {
    const b = string.toLowerCase();

    return Object.values(enumObject).find(a => a.toLowerCase() === b) || null;
}

const hashState = new HashState({
    'src': {
        defaultValue: flagGroupDefaults.imageSrc,
        parse: value => decodeURIComponent(value),
        stringify: value => !getObject(value)
            ? encodeURIComponent(value)
            : undefined
    },
    'backsidesrc': {
        defaultValue: flagGroupDefaults.backSideImageSrc,
        parse: value => decodeURIComponent(value),
        stringify: value => !getObject(value)
            ? encodeURIComponent(value)
            : undefined
    },
    'hoisting': {
        defaultValue: flagGroupDefaults.hoisting,
        parse: (string) => {
            if (string.match(/^dex(ter)?$/gi)) {
                return Hoisting.DEXTER;
            } else if (string.match(/^sin(ister)?$/gi)) {
                return Hoisting.SINISTER;
            }

            return null;
        },
        stringify: value => 'sin'
    },
    'orientation': {
        defaultValue: flagGroupDefaults.orientation,
        parse: string => parseEnumValue(Side, string)
    },
    'flagpoletype': {
        defaultValue: flagGroupDefaults.flagpoleType,
        parse: string => parseEnumValue(FlagpoleType, string)
    },
    'vhoisting': {
        defaultValue: flagGroupDefaults.verticalHoisting,
        parse: string => parseEnumValue(VerticalHoisting, string)
    },
    'background': {
        defaultValue: sceneryDefaults.background,
        parse: string => parseEnumValue(SceneryBackground, string)
    },
    'backgroundcolor': {
        defaultValue: sceneryDefaults.backgroundColor,
        parse: value => isColorHex(`#${value}`) ? `#${value}` : null,
        stringify: value => value.slice(1)
    },
    'backgroundimage': {
        defaultValue: sceneryDefaults.backgroundImageSrc,
        parse: value => decodeURIComponent(value),
        stringify: value => !getObject(value)
            ? encodeURIComponent(value)
            : undefined
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
    const present = state.editor.present;

    return {
        src:                    present.flagGroup.imageSrc,
        backsidesrc:            present.flagGroup.backSideImageSrc,
        hoisting:               present.flagGroup.hoisting,
        orientation:            present.flagGroup.orientation,
        flagpoletype:           present.flagGroup.flagpoleType,
        vhoisting:              present.flagGroup.verticalHoisting,
        background:             present.scenery.background,
        backgroundcolor:        present.scenery.backgroundColor,
        backgroundimage:        present.scenery.backgroundImageSrc
    };
}

function mapStateFromHash(state) {
    return {
        flagGroup: assignDefaults(flagGroupDefaults, {
            imageSrc:           state.src,
            backSideImageSrc:   state.backsidesrc,
            isTwoSided:         !!state.backsidesrc,
            hoisting:           state.hoisting,
            orientation:        state.orientation,
            flagpoleType:       state.flagpoletype,
            verticalHoisting:   state.vhoisting
        }),
        scenery: {
            background:         state.background,
            backgroundColor:    state.backgroundcolor,
            backgroundImageSrc: state.backgroundimage
        }
    };
}

function isValidState(state) {
    const { imageSrc, backSideImageSrc } = state.editor.present.flagGroup;

    return !!(
        // Has an image
        imageSrc &&
        // Not a local file
        !getObject(imageSrc) &&
        !getObject(backSideImageSrc)
    );
}

function withLegacyFallbacks(oldState) {
    let state = oldState;

    // Backwards compatibility for old link structure
    if (!state.src) {
        const hash = window.location.hash.slice(1);

        if ((/^[^!\?].*/).test(hash)) {
            state = {
                ...state,
                src: window.unescape(hash)
            };
        }
    }

    // Backwards compatibility for old topedge param
    if (state.topedge && state.orientation === flagGroupDefaults.orientation) {
        state = {
            ...state,
            orientation: parseEnumValue(Side, state.topedge)
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
    const state = mapStateFromHash(withLegacyFallbacks(hashState.getState()));

    store.dispatch(setFlagGroupOptions(state.flagGroup));
    store.dispatch(setSceneryOptions(state.scenery));
    store.dispatch(clearHistory());
}
