import { isObject } from '../utils/TypeUtils';

class PropertyValidator {
    constructor(validators) {
        this.validators = validators || {};
    }

    validate(options, strict) {
        const validators = this.validators;

        if (isObject(options)) {
            return Object.keys(options).reduce((result, key) => {
                const value = options[key];

                if (typeof value !== 'undefined') {
                    if (validators[key]) {
                        const validated = validators[key](value);

                        if (validated != null) {
                            result[key] = validated;
                        }
                    } else if (!strict) {
                        result[key] = value;
                    }
                }

                return result;
            }, {});
        }

        return {};
    }
}

export default function createPropertyValidator(validators) {
    const propertyValidator = new PropertyValidator(validators);

    return (options, strict) => propertyValidator.validate(options, strict);
}
