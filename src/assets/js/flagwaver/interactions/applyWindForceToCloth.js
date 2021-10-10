import { Vector3 } from 'three';

import { DRAG_COEFFICIENT } from '../constants';
import localizeForce from './utils/localizeForce';

const cb = new Vector3();
const ab = new Vector3();

function computeFaceNormal(vA, vB, vC) {
    cb.subVectors(vC, vB);
    ab.subVectors(vA, vB);
    cb.cross(ab);
    cb.normalize();

    return cb;
}

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
    const index = cloth.geometry.getIndex();

    if (wind) {
        const faceArea = cloth.restDistance * cloth.restDistance / 2;

        const force = localizeForce(wind.pressure, object)
            .multiplyScalar(DRAG_COEFFICIENT * faceArea / 3);

        for (let i = 0, ii = index.count; i < ii; i += 3) {
            const a = index.getX(i);
            const b = index.getX(i + 1);
            const c = index.getX(i + 2);

            const particleA = particles[a];
            const particleB = particles[b];
            const particleC = particles[c];

            const projectedForce = computeFaceNormal(
                particleA.position,
                particleB.position,
                particleC.position
            );

            projectedForce.multiplyScalar(projectedForce.dot(force));

            particleA.applyForce(projectedForce);
            particleB.applyForce(projectedForce);
            particleC.applyForce(projectedForce);
        }
    }
}
