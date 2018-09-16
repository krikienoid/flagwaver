import Utils from '../utils/Utils';

function PropertyValidator(validators) {
    this.validators = validators || {};
}

Object.assign(PropertyValidator.prototype, {
    validate: function (options, strict) {
        var validators = this.validators;
        var hasOptions = Utils.isObject(options);
        var result = {};
        var key, validated;

        if (hasOptions) {
            for (key in options) {
                if (Utils.hasProperty(options, key)) {
                    if (typeof options[key] !== 'undefined') {
                        if (validators[key]) {
                            validated = validators[key](options[key]);

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
});

function createPropertyValidator(validators) {
    var propertyValidator = new PropertyValidator(validators);

    return function (options, strict) {
        return propertyValidator.validate(options, strict);
    };
}

export default createPropertyValidator;
