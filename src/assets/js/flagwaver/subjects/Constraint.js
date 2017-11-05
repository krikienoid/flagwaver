import THREE from 'three';

/**
 * @class Constraint
 *
 * @classdesc Represents a spring constraint in a mass-spring system.
 *
 * @param {Particle} p1
 * @param {Particle} p2
 * @param {number} restDistance
 */
function Constraint(p1, p2, restDistance) {
    this.p1 = p1;
    this.p2 = p2;
    this.restDistance = restDistance;
}

Object.assign(Constraint.prototype, {
    resolve: (function () {
        var diff = new THREE.Vector3();

        return function resolve() {
            var p1 = this.p1;
            var p2 = this.p2;
            var restDistance = this.restDistance;

            var currentDistance;
            var correction;

            diff.subVectors(p2.position, p1.position);
            currentDistance = diff.length();

            if (currentDistance === 0) { return; } // Prevents division by 0

            correction = diff.multiplyScalar(
                (1 - restDistance / currentDistance) / 2
            );

            p1.position.add(correction);
            p2.position.sub(correction);
        };
    })()
});

export default Constraint;
