import { parse, stringify } from './QueryString';

const fieldDefaults = {
    defaultValue: '',
    parse: param => param,
    stringify: value => value
};

function keysToLowerCase(object) {
    return Object.keys(object).reduce((result, key) => {
        result[key.toLowerCase()] = object[key];

        return result;
    }, {});
}

function isIgnored(field, value) {
    return value === field.defaultValue || value === '' || value == null;
}

export default class ParamState {
    constructor(fields) {
        this.fields = Object.keys(fields).reduce((result, key) => {
            result[key] = Object.assign({}, fieldDefaults, fields[key]);

            return result;
        }, {});
    }

    parse(string) {
        const fields = this.fields;
        const params = keysToLowerCase(parse(string));

        return Object.keys(fields).reduce((state, key) => {
            const field = fields[key];
            const param = params[key];
            const value = param && field.parse(param);

            state[key] = !isIgnored(field, value) ? value : field.defaultValue;

            return state;
        }, params);
    }

    stringify(state) {
        const fields = this.fields;

        return stringify(Object.keys(fields).reduce((params, key) => {
            const field = fields[key];
            const value = state[key];

            if (!isIgnored(field, value)) {
                params[key] = field.stringify(value);
            }

            return params;
        }, {}));
    }
}
