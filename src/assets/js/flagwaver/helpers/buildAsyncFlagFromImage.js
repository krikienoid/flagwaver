import buildFlag from '../helpers/buildFlag';
import buildRectangularFlagFromImage from '../helpers/buildRectangularFlagFromImage';
import loadImage from '../helpers/loadImage';

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
