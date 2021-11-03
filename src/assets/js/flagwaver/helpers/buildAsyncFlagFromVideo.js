import buildFlag from './buildFlag';
import buildRectangularFlagFromMedia
    from './buildRectangularFlagFromMedia';
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
export default function buildAsyncFlagFromVideo(src, options) {
    const isBrowserIE11 = window.document.documentMode;

    return new Promise((resolve, reject) => {
        if (isBrowserIE11) {
            reject(
                buildFlag(options)
            );
        }

        loadVideo(
            src,
            (element) => {
                resolve(
                    buildRectangularFlagFromMedia(element, options)
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
