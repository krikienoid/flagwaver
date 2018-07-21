import Utils from '../utils/Utils';
import Flag from '../subjects/Flag';
import buildRectangularFlagFromImage from './buildRectangularFlagFromImage';

function ensureNumericSize(options) {
    var result = Object.assign({}, options);

    if (!Utils.isNumeric(result.width)) {
        result.width = Flag.defaults.width;
    }

    if (!Utils.isNumeric(result.height)) {
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
function buildFlag(image, options) {
    if (image) {
        return buildRectangularFlagFromImage(image, options);
    }

    return new Flag(ensureNumericSize(options));
}

export default buildFlag;
