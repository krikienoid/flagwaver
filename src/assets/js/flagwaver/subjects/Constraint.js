import THREE from 'three';

const diff = new THREE.Vector3();

/**
 * @class Constraint
 *
 * @classdesc Represents a spring constraint in a mass-spring system.
 *
 * @param {Particle} p1
 * @param {Particle} p2
 * @param {number} restDistance
 */
export default class Constraint {
    constructor(p1, p2, restDistance) {
        this.p1 = p1;
        this.p2 = p2;
        this.restDistance = restDistance;
    }

    resolve() {
        const p1 = this.p1;
        const p2 = this.p2;
        const restDistance = this.restDistance;

        diff.subVectors(p2.position, p1.position);

        const currentDistance = diff.length();

        if (currentDistance === 0) { return; } // Prevents division by 0

        const correction = diff.multiplyScalar(
            (1 - restDistance / currentDistance) / 2
        );

        p1.position.add(correction);
        p2.position.sub(correction);
    }
}
