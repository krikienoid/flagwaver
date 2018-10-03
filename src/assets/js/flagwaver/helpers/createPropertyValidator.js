import Utils from '../utils/Utils';

class PropertyValidator {
    constructor(validators) {
        this.validators = validators || {};
    }

    validate(options, strict) {
        const validators = this.validators;
        const hasOptions = Utils.isObject(options);
        const result = {};

        if (hasOptions) {
            for (const key in options) {
                if (Utils.hasProperty(options, key)) {
                    if (typeof options[key] !== 'undefined') {
                        if (validators[key]) {
                            const validated = validators[key](options[key]);

                            if (validated != null) {
                                result[key] = validated;
                            }
                        } else if (!strict) {
                            result[key] = options[key];
                        }
                    }
                }
            }
        }

        return result;
    }
}

export default function createPropertyValidator(validators) {
    const propertyValidator = new PropertyValidator(validators);

    return (options, strict) => propertyValidator.validate(options, strict);
}
