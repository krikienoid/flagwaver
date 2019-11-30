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
    const poleRadius = options.poleWidth / 2;
    const poleLength = options.poleLength;
    const poleCapRadius = options.poleCapSize / 2;

    const geometry = new THREE.CylinderGeometry(
        poleRadius,
        poleRadius,
        poleLength
    );

    geometry.translate(0, options.poleLength / 2, 0);

    // Add finial cap
    const capGeometry = new THREE.CylinderGeometry(
        poleCapRadius,
        poleCapRadius,
        poleCapRadius
    );

    capGeometry.translate(0, poleLength + poleCapRadius / 2, 0);

    geometry.merge(capGeometry);

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

    const poleRadius = options.poleWidth / 2;
    const poleLength = options.poleLength;
    const crossbarRadius = options.crossbarWidth / 2;
    const crossbarLength = options.crossbarLength;
    const crossbarCapRadius = options.crossbarCapSize / 2;
    const poleTopOffset = options.poleTopOffset;

    // Create crossbar
    const crossbarGeometry = new THREE.CylinderGeometry(
        crossbarRadius,
        crossbarRadius,
        crossbarLength
    );

    crossbarGeometry.rotateZ(Math.PI / 2);

    // Create crossbar caps
    const capGeometry = new THREE.CylinderGeometry(
        crossbarCapRadius,
        crossbarCapRadius,
        crossbarCapRadius
    );

    const capGeometry2 = capGeometry.clone();

    // Left crossbar cap
    capGeometry.rotateZ(Math.PI / 2);
    capGeometry.translate(-crossbarLength / 2, 0, 0);

    crossbarGeometry.merge(capGeometry);

    // Right crossbar cap
    capGeometry2.rotateZ(-Math.PI / 2);
    capGeometry2.translate(crossbarLength / 2, 0, 0);

    crossbarGeometry.merge(capGeometry2);

    crossbarGeometry.translate(
        0,
        poleLength - poleTopOffset,
        poleRadius + crossbarRadius
    );

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

    const poleLength = options.poleLength;
    const poleCapRadius = options.poleCapSize / 2;
    const crossbarRadius = options.crossbarWidth / 2;
    const crossbarLength = options.crossbarLength;

    // Create crossbar
    const crossbarGeometry = new THREE.CylinderGeometry(
        crossbarRadius,
        crossbarRadius,
        crossbarLength
    );

    crossbarGeometry.rotateZ(Math.PI / 2);

    crossbarGeometry.translate(
        crossbarLength / 2,
        poleLength + poleCapRadius - crossbarRadius,
        0
    );

    // Attach crossbar
    geometry.merge(crossbarGeometry);

    return geometry;
}
