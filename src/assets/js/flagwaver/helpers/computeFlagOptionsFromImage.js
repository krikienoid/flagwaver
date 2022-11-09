import { Texture, VideoTexture } from 'three';

import { Hoisting, Side } from '../constants';
import getAngleOfSide from '../utils/getAngleOfSide';
import { isNumeric, isObject } from '../utils/TypeUtils';
import Flag from '../subjects/Flag';

// Maximum size of flag
const maxSize = 500;

const defaults = {
    image:                      null,
    backSideImage:              null,
    width:                      'auto',
    height:                     'auto',
    hoisting:                   Hoisting.DEXTER,
    orientation:                Side.TOP,
    resolution:                 256 // px per meter
};

// Calculate width and/or height from image if either is set to 'auto'
function computeSizeFromElement(element, options) {
    const elementWidth = element.width || element.videoWidth;
    const elementHeight = element.height || element.videoHeight;

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
    const { width, height } = element
        ? computeSizeFromElement(element, options)
        : options;

    if (isNumeric(width) && isNumeric(height)) {
        // Downscale images that exceed maxSize
        const scale = Math.min(1, maxSize / Math.max(width, height));

        return {
            width: width * scale,
            height: height * scale
        };
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

// Generate transformed texture from image using HTML canvas
function scaleImage(image, options) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const srcWidth = image.width;
    const srcHeight = image.height;

    // Downscale textures that exceed max resolution
    const scale = Math.min(1, options.height * options.resolution / srcHeight);

    const destWidth = Math.round(srcWidth * scale);
    const destHeight = Math.round(srcHeight * scale);

    canvas.width = destWidth;
    canvas.height = destHeight;

    ctx.drawImage(image, 0, 0, destWidth, destHeight);

    return canvas;
}

// Generate transformed texture from image
function createTextureFromElement(element, options, transform) {
    const texture = element instanceof HTMLVideoElement
        ? new VideoTexture(element)
        : new Texture(scaleImage(element, options));

    texture.matrixAutoUpdate = false;

    if (isObject(transform)) {
        const matrix = texture.matrix;

        matrix.scale(1, 1);

        // Reflect
        if (transform.reflect) {
            matrix.translate(-1, 0).scale(-1, 1);
        }

        // Rotate around center
        if (isNumeric(transform.rotate)) {
            matrix
                .translate(-0.5, -0.5)
                .rotate(-transform.rotate)
                .translate(0.5, 0.5);
        }
    }

    return texture;
}

// Compute values needed to create new flag
function computeFlagArgs(options) {
    const result = {};

    if (isVertical(options)) {
        result.width  = options.height;
        result.height = options.width;
    } else {
        result.width  = options.width;
        result.height = options.height;
    }

    const isSinister = options.hoisting === Hoisting.SINISTER;
    let { image, backSideImage } = options;

    if (isSinister && backSideImage) {
        const tmp = image;

        image = backSideImage;
        backSideImage = tmp;
    }

    if (image) {
        result.texture = createTextureFromElement(
            image,
            options,
            {
                reflect: backSideImage ? false : isSinister,
                rotate: getAngleOfSide(options.orientation)
            }
        );
    }

    if (backSideImage) {
        result.backSideTexture = createTextureFromElement(
            backSideImage,
            options,
            {
                reflect: true,
                rotate: -getAngleOfSide(options.orientation)
            }
        );
    }

    return result;
}

/**
 * @function computeFlagOptionsFromImage
 *
 * @description Helper for generating flags from rectangular designs
 * that can be rotated and flipped.
 *
 * @param {Object} [options]
 *   @param {HTMLImageElement|HTMLVideoElement} [image]
 *   @param {HTMLImageElement|HTMLVideoElement} [backSideImage]
 *   @param {number|string} [width]
 *   @param {number|string} [height]
 *   @param {Hoisting} [hoisting]
 *   @param {Side} [orientation]
 *   @param {number} [resolution]
 */
export default function computeFlagOptionsFromImage(options) {
    const settings = Object.assign({}, defaults, options);

    Object.assign(settings, computeSize(settings.image, settings));

    // Init models and create meshes once images(s) have loaded
    return computeFlagArgs(settings);
}
