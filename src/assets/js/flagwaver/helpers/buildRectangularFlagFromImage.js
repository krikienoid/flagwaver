import THREE from 'three';

import { Hoisting, Side } from '../constants';
import getAngleOfSide from '../utils/getAngleOfSide';
import { isNumeric, isObject } from '../utils/TypeUtils';
import Flag from '../subjects/Flag';

const defaults = {
    width: 'auto',
    height: 'auto',
    hoisting: Hoisting.DEXTER,
    orientation: Side.TOP
};

// Calculate width and/or height from image if either is set to 'auto'
function computeSizeFromImage(image, options) {
    if (options.width === 'auto' && options.height === 'auto') {
        const crossWidth = Flag.defaults.height;

        if (image.width < image.height) {
            // Vertical
            return {
                width:  crossWidth,
                height: crossWidth * image.height / image.width
            };
        } else {
            // Horizontal or square
            return {
                width:  crossWidth * image.width / image.height,
                height: crossWidth
            };
        }
    } else if (options.width === 'auto' && isNumeric(options.height)) {
        return {
            width:  options.height * image.width / image.height,
            height: options.height
        };
    } else if (isNumeric(options.width) && options.height === 'auto') {
        return {
            width:  options.width,
            height: options.width * image.height / image.width
        };
    } else {
        return {
            width:  options.width,
            height: options.height
        };
    }
}

// Compute a numeric width and height from options
function computeSize(image, options) {
    let size = {
        width:  options.width,
        height: options.height
    };

    if (image) {
        size = computeSizeFromImage(image, size);
    }

    if (isNumeric(size.width) && isNumeric(size.height)) {
        return size;
    } else {
        return {
            width:  Flag.defaults.width,
            height: Flag.defaults.height
        };
    }
}

// Check if flag has been rotated into a vertical position
function isVertical(options) {
    return (
        options.orientation === Side.LEFT ||
        options.orientation === Side.RIGHT
    );
}

// Compute values needed to apply texture onto mesh
function computeTextureArgs(options) {
    const result = {};

    result.reflect = options.hoisting === Hoisting.SINISTER;
    result.rotate = getAngleOfSide(options.orientation);

    return result;
}

// Generate transformed texture from image
function createTextureFromImage(image, options) {
    const texture = new THREE.Texture(image);

    texture.matrixAutoUpdate = false;

    if (isObject(options)) {
        const matrix = texture.matrix;

        matrix.scale(1, 1);

        // Reflect
        if (options.reflect) {
            matrix.translate(-1, 0).scale(-1, 1);
        }

        // Rotate around center
        if (isNumeric(options.rotate)) {
            matrix
                .translate(-0.5, -0.5)
                .rotate(-options.rotate)
                .translate(0.5, 0.5);
        }
    }

    return texture;
}

// Compute values needed to create new flag
function computeFlagArgs(image, options) {
    const result = Object.assign({}, options);

    if (isVertical(options)) {
        result.width  = options.height;
        result.height = options.width;
    }

    if (image) {
        result.texture = createTextureFromImage(
            image,
            computeTextureArgs(options)
        );
    }

    return result;
}

/**
 * @function buildRectangularFlagFromImage
 *
 * @description Helper for generating flags from rectangular designs
 * that can be rotated and flipped.
 *
 * @param {HTMLImageElement} image
 * @param {Object} [options]
 */
export default function buildRectangularFlagFromImage(image, options) {
    const settings = Object.assign({}, defaults, options);

    Object.assign(settings, computeSize(image, settings));

    // Init models and create meshes once images(s) have loaded
    return new Flag(computeFlagArgs(image, settings));
}
