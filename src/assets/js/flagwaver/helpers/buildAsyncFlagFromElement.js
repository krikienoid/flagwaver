import buildFlag from './buildFlag';
import buildRectangularFlagFromElement
    from './buildRectangularFlagFromElement';
import loadImage from './loadImage';
import loadVideo from './loadVideo';

function getLoadFunction(src, options) {
    const matcher = (m) => { return m.endsWith('.mp4') || m.endsWith('.mov'); };
    if (src.startsWith('blob:')) {
        return (options.type == 'video' ? loadVideo : loadImage);
    }
    return matcher(src) ? loadVideo : loadImage;
}

/**
 * @function buildAsyncFlagFromElement
 *
 * @description If a new image needs to be loaded, flag options
 * must be set asynchronously after image loading has completed.
 *
 * @param {string} src
 * @param {Object} [options]
 */
export default function buildAsyncFlagFromElement(src, options) {
    return new Promise((resolve, reject) => {
        getLoadFunction(src, options)(
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
