import { Texture, VideoTexture } from 'three';

import { Hoisting, Side } from '../constants';
import getAngleOfSide from '../utils/getAngleOfSide';
import { isNumeric, isObject } from '../utils/TypeUtils';
import Flag from '../subjects/Flag';
import VideoFlag from '../subjects/VideoFlag';

const defaults = {
    width: 'auto',
    height: 'auto',
    hoisting: Hoisting.DEXTER,
    orientation: Side.TOP
};

// Calculate width and/or height from image if either is set to 'auto'
function computeSizeFromElement(element, options) {
    let elementWidth = element.width || element.videoWidth;
    let elementHeight = element.height || element.videoHeight;

    if (options.width === 'auto' && options.height === 'auto') {
        const crossWidth = Flag.defaults.height;

        if (elementWidth < elementHeight) {
            // Vertical
            return {
                width:  crossWidth,
                height: crossWidth * elementHeight / elementWidth
            };
        } else {
            // Horizontal or square
            return {
                width:  crossWidth * elementWidth / elementHeight,
                height: crossWidth
            };
        }
    } else if (options.width === 'auto' && isNumeric(options.height)) {
        return {
            width:  options.height * elementWidth / elementHeight,
            height: options.height
        };
    } else if (isNumeric(options.width) && options.height === 'auto') {
        return {
            width:  options.width,
            height: options.width * elementHeight / elementWidth
        };
    } else {
        return {
            width:  options.width,
            height: options.height
        };
    }
}

// Compute a numeric width and height from options
function computeSize(element, options) {
    let size = {
        width:  options.width,
        height: options.height
    };

    if (element) {
        size = computeSizeFromElement(element, size);
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
function createTextureFromElement(element, options) {
    const texture = element instanceof HTMLVideoElement
        ? new VideoTexture(element)
        : new Texture(element);

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
function computeFlagArgs(element, options) {
    const result = Object.assign({}, options);

    if (isVertical(options)) {
        result.width  = options.height;
        result.height = options.width;
    }

    if (element) {
        result.texture = createTextureFromElement(
            element,
            computeTextureArgs(options)
        );
    }

    return result;
}

/**
 * @function buildRectangularFlagFromMedia
 *
 * @description Helper for generating flags from rectangular designs
 * that can be rotated and flipped.
 *
 * @param {HTMLImageElement|HTMLVideoElement} element
 * @param {Object} [options]
 */
export default function buildRectangularFlagFromMedia(element, options) {
    const settings = Object.assign({}, defaults, options);

    Object.assign(settings, computeSize(element, settings));

    // Init models and create meshes once images(s) have loaded
    const args = computeFlagArgs(element, settings);
    const flag = element instanceof HTMLVideoElement
        ? new VideoFlag(args)
        : new Flag(args);

    return flag;
}
