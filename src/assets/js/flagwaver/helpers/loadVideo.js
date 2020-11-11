/**
 * @function loadVideo
 *
 * @description Helper for loading videos.
 *
 * @param {string} src
 * @param {Function} [callback]
 * @param {Function} [error]
 */
export default function loadVideo(src, callback, error) {
    const video = document.createElement('video');

    video.addEventListener('loadeddata', function () {
        callback(video);
    });

    video.addEventListener('error', function (e) {
        console.error(
            'FlagWaver.loadVideo: Failed to load video.'
        );

        if (error) {
            error(e);
        }
    });

    video.crossOrigin = 'anonymous';
    video.src = src;
    video.loop = true;
    video.preload = 'auto';
}
