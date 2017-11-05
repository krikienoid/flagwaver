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
function Wind(options) {
    var settings = Object.assign({}, Wind.defaults, options);

    this.direction          = settings.direction;
    this.speed              = settings.speed;
    this.directionModifier  = settings.directionModifier;
    this.speedModifier      = settings.speedModifier;

    this.force = new THREE.Vector3();
}

Object.assign(Wind, {
    defaults: {
        direction:          new THREE.Vector3(1, 0, 0),
        speed:              200,
        directionModifier:  WindModifiers.blowFromLeftDirection,
        speedModifier:      WindModifiers.constantSpeed
    }
});

Object.assign(Wind.prototype, {
    update: function () {
        var force = this.force;
        var time = Date.now();

        force.copy(this.direction);
        this.directionModifier(this, time);

        force.normalize();
        this.speedModifier(this, time);
    }
});

export default Wind;
