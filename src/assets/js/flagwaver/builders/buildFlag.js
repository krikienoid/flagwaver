import { isNumeric } from '../utils/TypeUtils';
import Flag from '../subjects/Flag';
import buildRectangularFlagFromImage from './buildRectangularFlagFromImage';

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
 * @param {HTMLImageElement} image
 * @param {Object} [options]
 */
export default function buildFlag(image, options) {
    if (image) {
        return buildRectangularFlagFromImage(image, options);
    }

    return new Flag(ensureNumericSize(options));
}
