import THREE from 'three';
import { Hoisting, Side } from '../constants';
import getAngleOfSide from '../utils/getAngleOfSide';
import { isNumeric, isObject } from '../utils/TypeUtils';
import Flag from '../subjects/Flag';

const defaults = {
    width: 'auto',
    height: 'auto',
    hoisting: Hoisting.DEXTER,
    topEdge: Side.TOP
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
    return options.topEdge === Side.LEFT || options.topEdge === Side.RIGHT;
}

// Compute values needed to apply texture onto mesh
function computeTextureArgs(options) {
    const result = {};

    result.width = options.width;
    result.height = options.height;
    result.reflect = options.hoisting === Hoisting.SINISTER;
    result.rotate = getAngleOfSide(options.topEdge);

    if (isVertical(options)) {
        const offset = (options.width - options.height) / 2;

        result.translateX = -offset;
        result.translateY = offset;
        result.flipXY = true;
    } else {
        result.translateX = 0;
        result.translateY = 0;
        result.flipXY = false;
    }

    return result;
}

// Generate transformed texture from image using HTML canvas
// (Requires images to be CORS enabled)
function createTextureFromImage(image, options) {
    const canvas = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'canvas'
    );

    const ctx           = canvas.getContext('2d');
    const srcWidth      = image.width;
    const srcHeight     = image.height;
    let destWidth       = srcWidth;
    let destHeight      = srcHeight;

    if (isObject(options)) {
        // Set destination size
        if (options.width  > 0) { destWidth  = options.width;  }
        if (options.height > 0) { destHeight = options.height; }

        // Swap X axis with Y axis
        if (options.flipXY) {
            canvas.width  = destHeight;
            canvas.height = destWidth;
        } else {
            canvas.width  = destWidth;
            canvas.height = destHeight;
        }

        // Reflect
        if (options.reflect) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        // Rotate around center
        if (isNumeric(options.rotate)) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(options.rotate);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // Translate X
        if (isNumeric(options.translateX)) {
            ctx.translate(options.translateX, 0);
        }

        // Translate Y
        if (isNumeric(options.translateY)) {
            ctx.translate(0, options.translateY);
        }
    } else {
        // Set canvas size
        canvas.width  = destWidth;
        canvas.height = destHeight;
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(
            'FlagWaver.buildRectangularFlagFromImage: Image texture created.' +
            '\n  ' + 'Natural size: ' +
                srcWidth + 'x' + srcHeight +
            '\n  ' + 'Texture size: ' +
                Math.round(canvas.width) + 'x' + Math.round(canvas.height) +
            '\n  ' + 'Natural aspect ratio: ' +
                Number((srcWidth / srcHeight).toFixed(4)) +
            '\n  ' + 'Texture aspect ratio: ' +
                Number((canvas.width / canvas.height).toFixed(4))
        );

        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(
        image, 0, 0, srcWidth, srcHeight, 0, 0, destWidth, destHeight
    );

    return new THREE.Texture(canvas);
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
