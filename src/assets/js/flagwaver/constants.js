//
// Static constants
//

// Flag to enable debug mode, false by default
var DEBUG   = false;

// Physics constants
var DAMPING = 0.03;
var DRAG    = 1 - DAMPING;
var G       = 9.81;

/**
 * Enum for flag hoisting side.
 *
 * @readonly
 * @enum {string}
 * @typedef {string} Hoisting
 */
var Hoisting = {
    DEXTER:   'dexter',
    SINISTER: 'sinister'
};

/**
 * Enum for cardinal directions.
 *
 * @readonly
 * @enum {string}
 * @typedef {string} Side
 */
var Side = {
    TOP:    'top',
    LEFT:   'left',
    BOTTOM: 'bottom',
    RIGHT:  'right'
};

/**
 * Enum for front and back sides.
 *
 * @readonly
 * @enum {string}
 * @typedef {string} Face
 */
var Face = {
    OBVERSE: 'obverse',
    REVERSE: 'reverse'
};

/**
 * Enum for flagpole types.
 *
 * @readonly
 * @enum {string}
 * @typedef {string} FlagpoleType
 */
var FlagpoleType = {
    VERTICAL:   'vertical',
    HORIZONTAL: 'horizontal',
    OUTRIGGER:  'outrigger',
    CROSSBAR:   'crossbar',
    GALLERY:    'gallery'
};

export {
    DEBUG,
    DAMPING,
    DRAG,
    G,
    Hoisting,
    Side,
    Face,
    FlagpoleType
};
