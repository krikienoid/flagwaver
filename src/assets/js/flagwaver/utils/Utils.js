const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @module Utils
 */
const Utils = {
    // Is valid number
    isNumeric: value => !isNaN(parseFloat(value)) && isFinite(value),

    // Is an object
    isObject: object => !!(object && typeof object === 'object'),

    // Object has property
    hasProperty: (object, key) => hasOwnProperty.call(object, key),

    // Object has value
    hasValue: (object, value) => {
        if (Utils.isObject(object)) {
            for (const key in object) {
                if (Utils.hasProperty(object, key)) {
                    if (object[key] === value) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    // Is a function
    isFunction: object => typeof object === 'function' &&
        typeof object.nodeType !== 'number'
};

export default Utils;
