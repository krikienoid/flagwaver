import Flagpole from '../subjects/Flagpole';

/**
 * @function buildFlagpole
 *
 * @description Helper for generating different types of flagpoles.
 *
 * @param {Object} [options]
 * @param {Flag} flag
 */
export default function buildFlagpole(options, flag) {
    const settings = Object.assign({}, options);
    let flagpole;

    flagpole = new Flagpole(settings);

    return flagpole;
}
