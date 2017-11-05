import THREE from 'three';
import localizeForce from './localizeForce';

/**
 * @function applyWindForceToCloth
 *
 * @description Applies wind force to cloth.
 *
 * @param {Cloth} cloth
 * @param {Wind} wind
 * @param {THREE.Object3D} [object]
 */
var applyWindForceToCloth = (function () {
    var tmp = new THREE.Vector3();

    return function applyWindForceToCloth(cloth, wind, object) {
        var particles = cloth.particles;
        var faces = cloth.geometry.faces;
        var force;

        var i, il;
        var face, normal;

        if (wind) {
            force = localizeForce(wind.force, object);

            for (i = 0, il = faces.length; i < il; i++) {
                face   = faces[i];
                normal = face.normal;

                tmp
                    .copy(normal)
                    .normalize()
                    .multiplyScalar(normal.dot(force));

                particles[face.a].applyForce(tmp);
                particles[face.b].applyForce(tmp);
                particles[face.c].applyForce(tmp);
            }
        }
    };
})();

export default applyWindForceToCloth;
