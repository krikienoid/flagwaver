import THREE from 'three';

const tmp = new THREE.Vector3();
const worldPosition = new THREE.Vector3();

/**
 * @function localizeForce
 *
 * @description Transforms a force vector from global space to local space.
 *
 * @param {THREE.Vector3} force - Vector representing a force
 * @param {THREE.Object3D} [object] - Local object
 */
export default function localizeForce(force, object) {
    /*
     * Converts the direction and magnitude of a given vector from
     * world coordinate space to the local space of the given object.
     * The given vector is expected to represent direction and magnitude
     * only, it does not represent a position in 3D space.
     */

    tmp.copy(force);

    if (object instanceof THREE.Object3D) {
        // Discard world position information
        worldPosition.setFromMatrixPosition(object.matrixWorld);
        tmp.add(worldPosition);

        object.worldToLocal(tmp);
    }

    return tmp;
}
