import THREE from 'three';
import Constraint from './Constraint';

var SLACK = 1.2;

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
function FixedConstraint() {
    Constraint.apply(this, arguments);
}

FixedConstraint.prototype = Object.create(Constraint.prototype);
FixedConstraint.prototype.constructor = FixedConstraint;

Object.assign(FixedConstraint.prototype, {
    // Satisfy constraint unidirectionally
    resolve: (function () {
        var diff = new THREE.Vector3();

        return function resolve() {
            var p1 = this.p1;
            var p2 = this.p2;
            var restDistance = this.restDistance * SLACK;

            var currentDistance;
            var correction;

            diff.subVectors(p1.position, p2.position);
            currentDistance = diff.length() / SLACK;
            diff.normalize();

            correction = diff.multiplyScalar(currentDistance - restDistance);

            if (currentDistance > restDistance) {
                p2.position.add(correction);
            }
        };
    })()
});

export default FixedConstraint;
