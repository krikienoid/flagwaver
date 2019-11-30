import THREE from 'three';

import { AIR_DENSITY } from '../constants';
import WindModifiers from './utils/WindModifiers';

function windPressure(speed) {
    return 0.5 * AIR_DENSITY * speed * speed;
}

// Perfectly aligned vectors can cause unexpected or unrealistic outcomes
// in the simulation. Use this function to induce minor disruptions.
function disturbVector(v) {
    if (v.x === 0) { v.x = 0.001; }
    if (v.y === 0) { v.y = 0.001; }
    if (v.z === 0) { v.z = 0.001; }

    return v;
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

        this.pressure = new THREE.Vector3();
    }

    static defaults = {
        direction:              new THREE.Vector3(1, 0, 0),
        speed:                  10, // m/s
        directionFn:            WindModifiers.blowFromLeftDirection,
        speedFn:                WindModifiers.constantSpeed
    };

    update() {
        const time = Date.now();

        this.directionFn(disturbVector(this.pressure.copy(this.direction)), time)
            .normalize()
            .multiplyScalar(
                windPressure(
                    this.speedFn(disturbScalar(this.speed), time)
                )
            );
    }
}
