import { Texture, VideoTexture } from 'three';

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
    var texture;
    if (element instanceof HTMLVideoElement) {
        if (window.document.documentMode) {
            const VidTex = function (video) {
                const scope = this;

                scope.video = video;
                scope.ctx2d = document.createElement('canvas').getContext('2d');
                let canvas = scope.ctx2d.canvas;
                canvas.width = video.videoWidth;
                canvas.setAttribute('videoSrc', video.src);
                canvas.height = video.videoHeight;

                scope.ctx2d.drawImage(scope.video, 0, 0,
                    canvas.width, canvas.height);
                Texture.call(scope, scope.ctx2d.canvas);

                scope.generateMipmaps = false;

                // Image renders? (sample red circle in base64)
                //scope.img = document.createElement('img');
                //scope.img.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='

                function update() {
                    if (!scope.video) {
                        return false;
                    }
                    requestAnimationFrame(update);
                    if ( scope.video.readyState >= scope.video.HAVE_CURRENT_DATA && !scope.video.paused) {
                        //scope.ctx2d.drawImage(scope.img, 0, 0, canvas.width, canvas.height);
                        scope.ctx2d.drawImage(scope.video, 0, 0, canvas.width, canvas.height);
                        scope.needsUpdate = true;
                    }
                }

                update();
            };

            VidTex.prototype = Object.create(Texture.prototype);
            VidTex.prototype.constructor = VidTex;
            texture = new VidTex(element);
        } else {
            texture = new VideoTexture(element);
        }
    } else {
        texture = new Texture(element);
    }

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
 * @function buildRectangularFlagFromElement
 *
 * @description Helper for generating flags from rectangular designs
 * that can be rotated and flipped.
 *
 * @param {HTMLImageElement|HTMLVideoElement} element
 * @param {Object} [options]
 */
export default function buildRectangularFlagFromElement(element, options) {
    const settings = Object.assign({}, defaults, options);

    Object.assign(settings, computeSize(element, settings));

    // Init models and create meshes once images(s) have loaded
    return new Flag(computeFlagArgs(element, settings));
}
