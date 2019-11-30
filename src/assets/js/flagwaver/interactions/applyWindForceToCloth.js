import THREE from 'three';

import { DRAG_COEFFICIENT } from '../constants';
import localizeForce from './utils/localizeForce';

const tmp = new THREE.Vector3();

/**
 * @function applyWindForceToCloth
 *
 * @description Applies wind force to cloth.
 *
 * @param {Cloth} cloth
 * @param {Wind} wind
 * @param {THREE.Object3D} [object]
 */
export default function applyWindForceToCloth(cloth, wind, object) {
    const particles = cloth.particles;
    const faces = cloth.geometry.faces;

    if (wind) {
        const faceArea = cloth.restDistance * cloth.restDistance / 2;

        const force = localizeForce(wind.pressure, object)
            .multiplyScalar(DRAG_COEFFICIENT * faceArea / 3);

        for (let i = 0, ii = faces.length; i < ii; i++) {
            const face   = faces[i];
            const normal = face.normal;

            tmp
                .copy(normal)
                .normalize()
                .multiplyScalar(normal.dot(force));

            particles[face.a].applyForce(tmp);
            particles[face.b].applyForce(tmp);
            particles[face.c].applyForce(tmp);
        }
    }
}
