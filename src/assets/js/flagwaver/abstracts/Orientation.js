import { Side } from '../constants';

const orientations = {};

let initialized = false;

/**
 * @module Orientation
 *
 * @description Represents one of the four 90 degree rotations possible
 * from each side of a rectangle. New instances cannot be created, this
 * module is only used to access predefined instances.
 */
class Orientation {
    constructor(options) {
        if (!initialized) {
            this.side = options.side;
            this.angle = options.angle;
        } else {
            throw new TypeError('Illegal constructor');
        }
    }

    static from(value) {
        // Return a predefined Orientation
        if (orientations[value]) {
            // If given value is a Side
            return orientations[value];
        } else if (value && value.side && value === orientations[value.side]) {
            // If given value is an Orientation
            return orientations[value.side];
        } else {
            // If given value does not match an Orientation
            return null;
        }
    }

    toString() {
        return this.side;
    }
}

// Initialize predefined Orientation instances
orientations[Side.TOP] = new Orientation({
    side: Side.TOP,
    angle: 0
});

orientations[Side.LEFT] = new Orientation({
    side: Side.LEFT,
    angle: -Math.PI / 2
});

orientations[Side.BOTTOM] = new Orientation({
    side: Side.BOTTOM,
    angle: Math.PI
});

orientations[Side.RIGHT] = new Orientation({
    side: Side.RIGHT,
    angle: Math.PI / 2
});

// Assign side relationships
// cw = clockwise, ccw = counterclockwise, xw = crosswise
orientations[Side.LEFT].cw =
    orientations[Side.BOTTOM].xw =
        orientations[Side.RIGHT].ccw =
            orientations[Side.TOP];

orientations[Side.BOTTOM].cw =
    orientations[Side.RIGHT].xw =
        orientations[Side.TOP].ccw =
            orientations[Side.LEFT];

orientations[Side.RIGHT].cw =
    orientations[Side.TOP].xw =
        orientations[Side.LEFT].ccw =
            orientations[Side.BOTTOM];

orientations[Side.TOP].cw =
    orientations[Side.LEFT].xw =
        orientations[Side.BOTTOM].ccw =
            orientations[Side.RIGHT];

// New Orientation instances cannot be created after initialization
initialized = true;

export default Orientation;
