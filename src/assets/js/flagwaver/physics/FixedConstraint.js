import THREE from 'three';
import Constraint from './Constraint';

const SLACK = 1.2;

const diff = new THREE.Vector3();

/**
 * @class FixedConstraint
 *
 * @classdesc A unidirectional spring constraint used to mitigate
 * the "super elastic" effect.
 *
 * @param {Particle} p1
 * @param {Particle} p2
 * @param {number} restDistance
 */
export default class FixedConstraint extends Constraint {
    // Satisfy constraint unidirectionally
    resolve() {
        const p1 = this.p1;
        const p2 = this.p2;
        const restDistance = this.restDistance * SLACK;

        diff.subVectors(p1.position, p2.position);

        const currentDistance = diff.length() / SLACK;

        diff.normalize();

        const correction = diff.multiplyScalar(currentDistance - restDistance);

        if (currentDistance > restDistance) {
            p2.position.add(correction);
        }
    }
}
