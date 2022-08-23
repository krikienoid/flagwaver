import buildRectangularFlagFromMedia from './buildRectangularFlagFromMedia';
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
    return new Promise((resolve, reject) => {
        loadVideo(
            src,
            (video) => {
                resolve(buildRectangularFlagFromMedia(video, options));
            },
            (e) => {
                reject(e);
            }
        );
    });
}
