import loadImage from '../helpers/loadImage';
import buildFlag from '../builders/buildFlag';
import buildRectangularFlagFromImage from '../builders/buildRectangularFlagFromImage';

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
            (image) => {
                resolve(
                    buildRectangularFlagFromImage(image, options)
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
