import Flagpole from '../subjects/Flagpole';

/**
 * @function buildFlagpole
 *
 * @description Helper for generating different types of flagpoles.
 *
 * @param {Object} [options]
 * @param {Flag} flag
 */
function buildFlagpole(options, flag) {
    var settings = Object.assign({}, options);
    var flagpole;

    flagpole = new Flagpole(settings);

    return flagpole;
}

export default buildFlagpole;
