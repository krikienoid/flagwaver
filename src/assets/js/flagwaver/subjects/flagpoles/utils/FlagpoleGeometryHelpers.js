import { CylinderGeometry } from 'three';
import { mergeBufferGeometries }
    from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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
    const poleSegments = 32;
    const poleCapRadius = options.poleCapSize / 2;

    const geometry = new CylinderGeometry(
        poleRadius,
        poleRadius,
        poleLength,
        poleSegments
    );

    geometry.translate(0, options.poleLength / 2, 0);

    // Add finial cap
    const capGeometry = new CylinderGeometry(
        poleCapRadius,
        poleCapRadius,
        poleCapRadius,
        poleSegments
    );

    capGeometry.translate(0, poleLength + poleCapRadius / 2, 0);

    return mergeBufferGeometries([geometry, capGeometry]);
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
    const crossbarSegments = 16;
    const crossbarCapRadius = options.crossbarCapSize / 2;
    const poleTopOffset = options.poleTopOffset;

    // Create crossbar
    const crossbarGeometry = new CylinderGeometry(
        crossbarRadius,
        crossbarRadius,
        crossbarLength,
        crossbarSegments
    );

    crossbarGeometry.rotateZ(Math.PI / 2);

    // Create crossbar caps
    const capGeometry = new CylinderGeometry(
        crossbarCapRadius,
        crossbarCapRadius,
        crossbarCapRadius,
        crossbarSegments
    );

    const capGeometry2 = capGeometry.clone();

    const yOffset = poleLength - poleTopOffset;
    const zOffset = poleRadius + crossbarRadius;

    // Left crossbar cap
    capGeometry.rotateZ(Math.PI / 2);
    capGeometry.translate(-crossbarLength / 2, yOffset, zOffset);

    // Right crossbar cap
    capGeometry2.rotateZ(-Math.PI / 2);
    capGeometry2.translate(crossbarLength / 2, yOffset, zOffset);

    crossbarGeometry.translate(0, yOffset, zOffset);

    return mergeBufferGeometries([
        geometry,
        crossbarGeometry,
        capGeometry,
        capGeometry2
    ]);
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
    const crossbarSegments = 16;

    // Create crossbar
    const crossbarGeometry = new CylinderGeometry(
        crossbarRadius,
        crossbarRadius,
        crossbarLength,
        crossbarSegments
    );

    crossbarGeometry.rotateZ(Math.PI / 2);

    crossbarGeometry.translate(
        crossbarLength / 2,
        poleLength + poleCapRadius - crossbarRadius,
        0
    );

    return mergeBufferGeometries([geometry, crossbarGeometry]);
}
