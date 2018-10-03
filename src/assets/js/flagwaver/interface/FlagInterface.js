import THREE from 'three';
import loadImage from '../helpers/loadImage';
import buildFlag from '../builders/buildFlag';

/**
 * @class FlagInterface
 *
 * @classdesc A wrapper object for managing a single flag.
 *
 * @param {Object} [options] - Options passed to buildFlag
 *   @param {string} [options.imgSrc] - Image to generate flag from
 */
export default class FlagInterface {
    constructor(options) {
        this.flag = null;
        this.object = new THREE.Object3D();

        this.setOptions(options);
    }

    destroy() {
        if (this.flag) {
            this.object.remove(this.flag.object);
            this.flag.destroy();
        }
    }

    setOptions(options, callback) {
        const settings = Object.assign({}, options);
        const src = settings.imgSrc;

        const replace = (flag) => {
            this.destroy();
            this.flag = flag;
            this.object.add(flag.object);

            if (callback) {
                callback(flag);
            }
        };

        replace(buildFlag(null, settings));

        /*
         * If a new image is to be loaded, options must be set
         * asynchronously after image loading has completed.
         */

        if (src) {
            loadImage(src, (image) => {
                replace(buildFlag(image, settings));
            });
        }
    }

    reset() {
        this.flag.reset();
    }

    simulate(deltaTime) {
        this.flag.simulate(deltaTime);
    }

    render() {
        this.flag.render();
    }
}
