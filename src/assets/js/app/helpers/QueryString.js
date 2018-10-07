export function parse(string) {
    const result = {};

    if (typeof string !== 'string') {
        return result;
    }

    const pairs = string.split('&');

    for (let i = 0, ii = pairs.length; i < ii; i++) {
        const pairString = pairs[i];

        if (pairString) {
            const pair = pairString.split('=');
            const key = pair[0];

            if (key) {
                // Set value to null if '=' sign is not present
                result[key] = (typeof pair[1] !== 'undefined')
                    ? pair.slice(1).join('=')
                    : null;
            }
        }
    }

    return result;
}

export function stringify(object) {
    const keys = Object.keys(object);
    const pairs = [];

    for (let i = 0, ii = keys.length; i < ii; i++) {
        const key = keys[i];
        const value = object[key];

        if (value === null) {
            pairs.push(key);
        } else if (typeof value !== 'undefined') {
            pairs.push(key + '=' + value);
        }
    }

    return pairs.join('&');
}

export default { parse, stringify };
