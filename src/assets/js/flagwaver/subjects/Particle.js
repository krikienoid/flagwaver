import THREE from 'three';
import { DRAG } from '../constants';

/**
 * @class Particle
 *
 * @classdesc Represents a mass in a mass-spring system.
 *
 * @param {THREE.Vector3} position
 * @param {number} mass
 */
function Particle(position, mass) {
    this.position       = position.clone();
    this.previous       = position.clone();
    this.original       = position.clone();
    this.mass           = mass;
    this.inverseMass    = 1 / mass;
    this.acceleration   = new THREE.Vector3();
    this.tmp            = new THREE.Vector3();
}

Object.assign(Particle.prototype, {
    // Apply force
    applyForce: function (force) {
        this.acceleration.addScaledVector(force, this.inverseMass);
    },

    // Compute new position
    integrate: function (deltaTimeSq) {
        // Perform verlet integration
        var tmp = this.tmp
            .subVectors(this.position, this.previous)
            .multiplyScalar(DRAG)
            .add(this.position)
            .addScaledVector(this.acceleration, deltaTimeSq);

        this.tmp      = this.previous;
        this.previous = this.position;
        this.position = tmp;

        this.acceleration.set(0, 0, 0);
    }
});

export default Particle;
