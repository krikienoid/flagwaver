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

/**
 * @function createPoleGeometryTypeT
 *
 * @description Build a crossbar flagpole.
 *
 *
 *     o
 *   -----
 *   ^   ^
 *   ^^^^^
 *     |
 *     |
 *
 *
 * @param {Object} options
 */
export function createPoleGeometryTypeT(options) {
    const geometry = createPoleGeometryTypeI(options);

    // Center
    geometry.translate(0, options.poleTopOffset, -options.poleWidth);

    // Create crossbar
    const crossbarGeometry = new THREE.CylinderGeometry(
        options.crossbarWidth,
        options.crossbarWidth,
        options.crossbarLength
    );

    crossbarGeometry.rotateZ(Math.PI / 2);

    // Create crossbar caps
    const capGeometry = new THREE.CylinderGeometry(
        options.crossbarCapSize,
        options.crossbarCapSize,
        options.crossbarCapSize
    );

    const capGeometry2 = capGeometry.clone();

    // Left crossbar cap
    capGeometry.rotateZ(Math.PI / 2);
    capGeometry.translate(-options.crossbarLength / 2, 0, 0);

    crossbarGeometry.merge(capGeometry);

    // Right crossbar cap
    capGeometry2.rotateZ(-Math.PI / 2);
    capGeometry2.translate(options.crossbarLength / 2, 0, 0);

    crossbarGeometry.merge(capGeometry2);

    // Attach crossbar
    geometry.merge(crossbarGeometry);

    return geometry;
}

/**
 * @function createPoleGeometryTypeL
 *
 * @description Build a gallery flagpole.
 *
 *
 *   o
 *   |-----
 *   |    ^
 *   |^^^^^
 *   |
 *   |
 *
 *
 * @param {Object} options
 */
export function createPoleGeometryTypeL(options) {
    const geometry = createPoleGeometryTypeI(options);

    // Create crossbar
    const crossbarGeometry = new THREE.CylinderGeometry(
        options.crossbarWidth,
        options.crossbarWidth,
        options.crossbarLength
    );

    crossbarGeometry.translate(0, -options.crossbarLength / 2, 0);
    crossbarGeometry.rotateZ(Math.PI / 2);

    // Attach crossbar
    geometry.merge(crossbarGeometry);

    return geometry;
}
