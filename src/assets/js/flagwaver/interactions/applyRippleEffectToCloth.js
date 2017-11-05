import THREE from 'three';

/**
 * @function applyRippleEffectToCloth
 *
 * @description Applies small random movements to cloth.
 *
 * @param {Cloth} cloth
 */
var applyRippleEffectToCloth = (function () {
    var tmp = new THREE.Vector3();

    return function applyRippleEffectToCloth(cloth) {
        var particles = cloth.particles;
        var strength = 100;
        var t = Date.now() / 1000;

        var i, il;
        var particle, x, y, z;

        for (i = 0, il = particles.length; i < il; i++) {
            particle = particles[i];
            x = particle.position.x;
            y = particle.position.y;
            z = particle.position.z;

            tmp
                .set(
                    Math.sin(x * y * t),
                    Math.cos(z * t),
                    Math.sin(Math.cos(5 * x * y * z))
                )
                .multiplyScalar(strength);

            particle.applyForce(tmp);
        }
    };
})();

export default applyRippleEffectToCloth;
