/**
 * @module Utils
 */
var Utils = {
    // Is valid number
    isNumeric: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Is an object
    isObject: function (object) {
        return !!(object && typeof object === 'object');
    },

    // Object has property
    hasProperty: (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        return function hasProperty(object, key) {
            return hasOwnProperty.call(object, key);
        };
    })(),

    // Object has value
    hasValue: function (object, value) {
        var key;

        if (Utils.isObject(object)) {
            for (key in object) {
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
    isFunction: function (object) {
        return typeof object === 'function' &&
            typeof object.nodeType !== 'number';
    }
};

export default Utils;
