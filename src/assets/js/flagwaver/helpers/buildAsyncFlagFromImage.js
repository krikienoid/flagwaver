import buildFlag from './buildFlag';
import buildRectangularFlagFromMedia
    from './buildRectangularFlagFromMedia';
import loadImage from './loadImage';

/**
 * @function buildAsyncFlagFromImage
 *
 * @description If a new image needs to be loaded, flag options
 * must be set asynchronously after image loading has completed.
 *
 * @param {string} src
 * @param {Object} [options]
 */
export default function buildAsyncFlagFromImage(src, options) {
    return new Promise((resolve, reject) => {
        loadImage(
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
