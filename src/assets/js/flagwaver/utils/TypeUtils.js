const hasOwnProperty = Object.prototype.hasOwnProperty;

// Is valid number
export const isNumeric = value => !isNaN(parseFloat(value)) && isFinite(value);

// Is an object
export const isObject = object => !!(object && typeof object === 'object');

// Object has property
export const hasProperty = (object, key) => hasOwnProperty.call(object, key);

// Object has value
export const hasValue = (object, value) =>
    isObject(object) && Object.keys(object).some(key => object[key] === value);

// Is a function
export const isFunction = object =>
    typeof object === 'function' && typeof object.nodeType !== 'number';
