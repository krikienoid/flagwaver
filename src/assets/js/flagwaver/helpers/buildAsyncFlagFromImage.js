import buildFlag from '../helpers/buildFlag';
import buildRectangularFlagFromElement from './buildRectangularFlagFromElement';
import loadImage from '../helpers/loadImage';
import loadVideo from '../helpers/loadVideo';

function getLoadFunctionByType(type) {
    switch (type) {
        case 'video':
            return loadVideo;
        case 'image':
        default:
            return loadImage;
    }
}

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
        getLoadFunctionByType(options.type)(
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
