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
export default class FlagGroupInterface {
    constructor(options) {
        this.object = new THREE.Object3D();

        this.flagpole = null;
        this.flagInterface = new FlagInterface(options);

        const setFlagOptions = this.flagInterface.setOptions.bind(this.flagInterface);

        // Wrapper method
        this.flagInterface.setOptions = (options, callback) => {
            setFlagOptions(options, (flag) => {
                if (this.flagpole) {
                    this.flagpole.needsUpdate = true;
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

    static FlagInterface = FlagInterface;

    destroy() {
        if (this.flagpole) {
            this.object.remove(this.flagpole.object);
            this.flagpole.destroy();
        }

        if (this.flagInterface) {
            this.object.remove(this.flagInterface.object);
            this.flagInterface.destroy();
        }
    }

    setFlagpoleOptions(options, callback) {
        const settings = Object.assign({}, options);

        const flagInterface = this.flagInterface;
        const flagpole = buildFlagpole(settings, this.flagInterface.flag);

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
    }

    setFlagOptions(options, callback) {
        this.flagInterface.setOptions(options, callback);
    }

    reset() {
    }

    simulate(deltaTime) {
    }

    render() {
        if (this.flagpole.needsUpdate) {
            this.setFlagpoleOptions();
        }
    }
}
