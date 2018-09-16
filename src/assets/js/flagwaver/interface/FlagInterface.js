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
function FlagInterface(options) {
    this.flag = null;
    this.object = new THREE.Object3D();

    this.setOptions(options);
}

Object.assign(FlagInterface.prototype, {
    destroy: function () {
        if (this.flag) {
            this.object.remove(this.flag.object);
            this.flag.destroy();
        }
    },

    setOptions: function (options, callback) {
        var self = this;

        var settings = Object.assign({}, options);
        var src = settings.imgSrc;

        function replace(flag) {
            self.destroy();
            self.flag = flag;
            self.object.add(flag.object);

            if (callback) {
                callback(flag);
            }
        }

        replace(buildFlag(null, settings));

        /*
         * If a new image is to be loaded, options must be set
         * asynchronously after image loading has completed.
         */

        if (src) {
            loadImage(src, function (image) {
                replace(buildFlag(image, settings));
            });
        }
    },

    reset: function () {
        this.flag.reset();
    },

    simulate: function (deltaTime) {
        this.flag.simulate(deltaTime);
    },

    render: function () {
        this.flag.render();
    }
});

export default FlagInterface;
