import THREE from 'three';

const tmp = new THREE.Vector3();

/**
 * @function applyRippleEffectToCloth
 *
 * @description Applies small random movements to cloth.
 *
 * @param {Cloth} cloth
 */
export default function applyRippleEffectToCloth(cloth) {
    const particles = cloth.particles;
    const strength = 0.004;
    const t = Date.now() / 1000;

    for (let i = 0, ii = particles.length; i < ii; i++) {
        const particle = particles[i];
        const { x, y, z } = particle.position;

        tmp
            .set(
                Math.sin(x * y * t),
                Math.cos(z * t),
                Math.sin(Math.cos(5 * x * y * z))
            )
            .multiplyScalar(strength);

        particle.applyForce(tmp);
    }
}
