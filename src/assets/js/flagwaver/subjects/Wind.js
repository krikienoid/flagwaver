import THREE from 'three';
import WindModifiers from './WindModifiers';

// Perfectly aligned vectors can cause unexpected or unrealistic outcomes
// in the simulation. Use this function to induce minor disruptions.
function disturbVector(v) {
    const w = v.clone();
    if (w.x === 0) { w.x = 0.001; }
    if (w.y === 0) { w.y = 0.001; }
    if (w.z === 0) { w.z = 0.001; }
    return w;
}

function disturbScalar(n) {
    return n === 0 ? 0.001 : n;
}

/**
 * @class Wind
 *
 * @param {Object} [options]
 *   @param {THREE.Vector3} [options.direction]
 *   @param {number} [options.speed]
 *   @param {Function} [options.directionFn]
 *   @param {Function} [options.speedFn]
 */
export default class Wind {
    constructor(options) {
        const settings = Object.assign({}, this.constructor.defaults, options);

        this.direction          = settings.direction;
        this.speed              = settings.speed;
        this.directionFn        = settings.directionFn;
        this.speedFn            = settings.speedFn;

        this.force = new THREE.Vector3();
    }

    static defaults = {
        direction:              new THREE.Vector3(1, 0, 0),
        speed:                  200,
        directionFn:            WindModifiers.blowFromLeftDirection,
        speedFn:                WindModifiers.constantSpeed
    };

    update() {
        const time = Date.now();

        this.force
            .copy(
                this.directionFn(disturbVector(this.direction), time)
            )
            .normalize()
            .multiplyScalar(
                this.speedFn(disturbScalar(this.speed), time)
            );
    }
}
