import THREE from 'three';

import { G } from '../constants';
import localizeForce from './utils/localizeForce';

const gravity = new THREE.Vector3(0, -G, 0);

/**
 * @function applyGravityToCloth
 *
 * @description Applies downward gravity force to cloth.
 *
 * @param {Cloth} cloth
 * @param {THREE.Object3D} [object]
 */
export default function applyGravityToCloth(cloth, object) {
    const particles = cloth.particles;
    const force = localizeForce(gravity, object);

    for (let i = 0, ii = particles.length; i < ii; i++) {
        particles[i].acceleration.add(force);
    }
}
