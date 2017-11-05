import THREE from 'three';

/**
 * @function localizeForce
 *
 * @description Transforms a force vector from global space to local space.
 *
 * @param {THREE.Vector3} force - Vector representing a force
 * @param {THREE.Object3D} [object] - Local object
 */
var localizeForce = (function () {
    /*
     * Converts the direction and magnitude of a given vector from
     * world coordinate space to the local space of the given object.
     * The given vector is expected to represent direction and magnitude
     * only, it does not represent a position in 3D space.
     */

    var tmp = new THREE.Vector3();
    var worldPosition = new THREE.Vector3();

    return function localizeForce(force, object) {
        tmp.copy(force);

        if (object instanceof THREE.Object3D) {
            // Discard world position information
            worldPosition.setFromMatrixPosition(object.matrixWorld);
            tmp.add(worldPosition);

            object.worldToLocal(tmp);
        }

        return tmp;
    };
})();

export default localizeForce;
