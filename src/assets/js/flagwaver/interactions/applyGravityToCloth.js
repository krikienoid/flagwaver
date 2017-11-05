import THREE from 'three';
import { G } from '../constants';
import localizeForce from './localizeForce';

/**
 * @function applyGravityToCloth
 *
 * @description Applies downward gravity force to cloth.
 *
 * @param {Cloth} cloth
 * @param {THREE.Object3D} [object]
 */
var applyGravityToCloth = (function () {
    var gravity = new THREE.Vector3(0, -G * 140, 0);

    return function applyGravityToCloth(cloth, object) {
        var particles = cloth.particles;
        var force = localizeForce(gravity, object);

        var i, il;

        for (i = 0, il = particles.length; i < il; i++) {
            particles[i].acceleration.add(force);
        }
    };
})();

export default applyGravityToCloth;
