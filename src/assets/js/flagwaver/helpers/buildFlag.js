import { isNumeric } from '../utils/TypeUtils';
import Flag from '../subjects/Flag';

function ensureNumericSize(options) {
    const result = Object.assign({}, options);

    if (!isNumeric(result.width)) {
        result.width = Flag.defaults.width;
    }

    if (!isNumeric(result.height)) {
        result.height = Flag.defaults.height;
    }

    return result;
}

/**
 * @function buildFlag
 *
 * @description Helper for generating flags based on provided image
 * and options.
 *
 * @param {Object} [options]
 */
export default function buildFlag(options) {
    return new Flag(ensureNumericSize(options));
}
