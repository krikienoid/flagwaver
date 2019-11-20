import cartesianProduct from '../utils/cartesianProduct';

/**
 * @function createInteraction
 *
 * @classdesc Generates an update function for managing
 * interactions between different types of subjects.
 *
 * @param {Function} action
 * @param {Array<Array<*>>} subjectLists
 */
export default function createInteraction(action, subjectLists) {
    const argLists = cartesianProduct(subjectLists);

    return (deltaTime) => {
        for (let i = 0, ii = argLists.length; i < ii; i++) {
            action(argLists[i]);
        }
    };
}
