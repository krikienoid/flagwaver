import THREE from 'three';
import WindModifiers from './WindModifiers';

/**
 * @class Wind
 *
 * @param {Object} [options]
 *   @param {THREE.Vector3} [options.direction]
 *   @param {number} [options.speed]
 *   @param {Function} [options.directionModifier]
 *   @param {Function} [options.speedModifier]
 */
export default class Wind {
    constructor(options) {
        const settings = Object.assign({}, this.constructor.defaults, options);

        this.direction          = settings.direction;
        this.speed              = settings.speed;
        this.directionModifier  = settings.directionModifier;
        this.speedModifier      = settings.speedModifier;

        this.force = new THREE.Vector3();
    }

    static defaults = {
        direction:          new THREE.Vector3(1, 0, 0),
        speed:              200,
        directionModifier:  WindModifiers.blowFromLeftDirection,
        speedModifier:      WindModifiers.constantSpeed
    };

    update() {
        const force = this.force;
        const time = Date.now();

        force.copy(this.direction);
        this.directionModifier(this, time);

        force.normalize();
        this.speedModifier(this, time);
    }
}
