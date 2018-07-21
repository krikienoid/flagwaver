import THREE from 'three';

/**
 * @function loadImage
 *
 * @description Helper for loading CORS enabled images.
 *
 * @param {string} src
 * @param {Function} [callback]
 * @param {Function} [error]
 */
var loadImage = (function () {
    var loader = new THREE.ImageLoader();

    loader.setCrossOrigin('anonymous');

    return function loadImage(src, callback, error) {
        loader.load(src, callback, null, function (e) {
            console.error(
                'FlagWaver.loadImage: Failed to load image from ' + src + '.'
            );

            if (error) {
                error(e);
            }
        });
    };
})();

export default loadImage;
