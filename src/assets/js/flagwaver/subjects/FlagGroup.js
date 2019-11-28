import THREE from 'three';

import Flag from './Flag';
import Flagpole from './flagpoles/Flagpole';

/**
 * @class FlagGroup
 *
 * @classdesc A wrapper object for managing a flagpole and flag.
 *
 * @param {Object} [options]
 *   @param {Flagpole} [options.flagpole]
 *   @param {Flag} [options.flag]
 */
export default class FlagGroup {
    constructor(options) {
        const settings = Object.assign({}, options);
        const { flagpole, flag } = settings;

        this.flagpole = flagpole || new Flagpole();
        this.flag = flag || new Flag();

        this.flagpole.addFlag(this.flag, 0);

        this.object = new THREE.Object3D();
        this.object.add(this.flagpole.object);
        this.object.add(this.flag.object);
    }

    destroy() {
        this.destroyChildSubject(this.flagpole);
        this.destroyChildSubject(this.flag);
    }

    destroyChildSubject(subject) {
        if (subject) {
            this.object.remove(subject.object);
            subject.destroy();
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
