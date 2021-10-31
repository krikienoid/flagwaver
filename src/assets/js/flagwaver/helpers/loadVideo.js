/**
 * @function loadVideo
 *
 * @description Helper for loading CORS-enabled videos.
 *
 * @param {string} src
 * @param {Function} [callback]
 * @param {Function} [error]
 */
export default function loadVideo(src, callback, error) {
    const video = document.createElement('video');

    video.addEventListener('loadeddata', function () {
        if (callback) {
            callback(video);
        }
    });

    video.addEventListener('error', function (e) {
        console.error(
            `FlagWaver.loadVideo: Failed to load video from ${src}.`
        );

        if (error) {
            error(e);
        }
    });

    video.crossOrigin = 'anonymous';
    video.src = src;
    video.loop = true;
    video.preload = 'auto';
    video.style.display = 'none';
    video.id = 'flagwaver-video';

    document.body.appendChild(video);
}
