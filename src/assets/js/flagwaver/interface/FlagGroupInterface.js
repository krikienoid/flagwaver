import THREE from 'three';
import buildFlagpole from '../builders/buildFlagpole';
import FlagInterface from './FlagInterface';

/**
 * @class FlagGroupInterface
 *
 * @classdesc A wrapper object for managing a flagpole and flag.
 *
 * @param {Object} [options] - Options passed to buildFlag and buildFlagpole
 */
function FlagGroupInterface(options) {
    var self = this;
    var setFlagOptions;

    this.object = new THREE.Object3D();

    this.flagpole = null;
    this.flagInterface = new FlagInterface(options);

    setFlagOptions = this.flagInterface.setOptions.bind(this.flagInterface);

    // Wrapper method
    this.flagInterface.setOptions = function (options, callback) {
        setFlagOptions(options, function (flag) {
            if (self.flagpole) {
                self.flagpole.needsUpdate = true;
            }

            if (callback) {
                callback(flag);
            }
        });
    };

    this.object.add(this.flagInterface.object);

    this.setFlagpoleOptions(options);
    this.setFlagOptions(options);
}

FlagGroupInterface.FlagInterface = FlagInterface;

Object.assign(FlagGroupInterface.prototype, {
    destroy: function () {
        if (this.flagpole) {
            this.object.remove(this.flagpole.object);
            this.flagpole.destroy();
        }

        if (this.flagInterface) {
            this.object.remove(this.flagInterface.object);
            this.flagInterface.destroy();
        }
    },

    setFlagpoleOptions: function (options, callback) {
        var settings = Object.assign({}, options);

        var flagInterface = this.flagInterface;
        var flagpole = buildFlagpole(settings, this.flagInterface.flag);

        if (this.flagpole) {
            this.object.remove(this.flagpole.object);
            this.flagpole.destroy();
        }

        this.flagpole = flagpole;
        this.object.add(flagpole.object);
        flagpole.needsUpdate = false;

        if (flagInterface && flagInterface.flag) {
            flagpole.addFlag(flagInterface.flag, 0);
        }

        if (callback) {
            callback(flagpole);
        }
    },

    setFlagOptions: function (options, callback) {
        this.flagInterface.setOptions(options, callback);
    },

    reset: function () {
    },

    simulate: function (deltaTime) {
    },

    render: function () {
        if (this.flagpole.needsUpdate) {
            this.setFlagpoleOptions();
        }
    }
});

export default FlagGroupInterface;
