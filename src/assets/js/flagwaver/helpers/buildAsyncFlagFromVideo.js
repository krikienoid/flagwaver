import buildFlag from './buildFlag';
import buildRectangularFlagFromElement
    from './buildRectangularFlagFromElement';
import loadVideo from './loadVideo';

/**
 * @function buildAsyncFlagFromVideo
 *
 * @description If a new video needs to be loaded, flag options
 * must be set asynchronously after video loading has completed.
 *
 * @param {string} src
 * @param {Object} [options]
 */
export default function buildAsyncFlagFromImage(src, options) {
    return new Promise((resolve, reject) => {
        loadVideo(
            src,
            (element) => {
                resolve(
                    buildRectangularFlagFromElement(element, options)
                );
            },
            () => {
                reject(
                    buildFlag(options)
                );
            }
        );
    });
}
