import buildFlag from './buildFlag';
import buildRectangularFlagFromElement
    from './buildRectangularFlagFromElement';
import loadImage from './loadImage';
import loadVideo from './loadVideo';

function getLoadFunction(src, options) {
    const endsWith = (str, suffix) => {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    const matcher = (m) => { return endsWith(m, '.mp4') || endsWith(m, '.mov'); };
    if (src.indexOf('blob:') === 0) {
        return (options.type === 'video' ? loadVideo : loadImage);
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
