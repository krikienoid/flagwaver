import THREE from 'three';

/**
 * @function createPoleGeometryTypeI
 *
 * @description Build a standard flagpole.
 *
 *
 *   o
 *   |^^^^^
 *   |    ^
 *   |^^^^^
 *   |
 *   |
 *
 *
 * @param {Object} options
 */
export function createPoleGeometryTypeI(options) {
    const geometry = new THREE.CylinderGeometry(
        options.poleWidth,
        options.poleWidth,
        options.poleLength
    );

    // Center
    geometry.translate(0, -options.poleLength / 2, 0);

    // Add finial cap
    geometry.merge(
        new THREE.CylinderGeometry(
            options.poleCapSize,
            options.poleCapSize,
            options.poleCapSize
        )
    );

    return geometry;
}
