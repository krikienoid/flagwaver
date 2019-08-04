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
        this.flagInterface.setOptions = options =>
            setFlagOptions(options).then((flag) => {
                if (this.flagpole) {
                    this.flagpole.needsUpdate = true;
                }
            });

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

    setFlagpoleOptions(options, callback, error) {
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

        return new Promise((resolve, reject) => {
            resolve(flagpole);
        });
    }

    setFlagOptions(options) {
        return this.flagInterface.setOptions(options);
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
