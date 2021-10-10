import { ImageLoader } from 'three';

const loader = new ImageLoader();

loader.setCrossOrigin('anonymous');

/**
 * @function loadImage
 *
 * @description Helper for loading CORS enabled images.
 *
 * @param {string} src
 * @param {Function} [callback]
 * @param {Function} [error]
 */
export default function loadImage(src, callback, error) {
    loader.load(src, callback, null, (e) => {
        console.error(
            `FlagWaver.loadImage: Failed to load image from ${src}.`
        );

        if (error) {
            error(e);
        }
    });
}
