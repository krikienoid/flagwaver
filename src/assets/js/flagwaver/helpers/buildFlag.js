import Flag from '../subjects/Flag';

/**
 * @function buildFlag
 *
 * @description Helper for generating flags based on provided image
 * and options.
 *
 * @param {Object} [options]
 */
export default function buildFlag(options) {
    return new Flag(options);
}
