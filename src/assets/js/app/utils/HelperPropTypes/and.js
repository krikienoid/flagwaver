export default function and(validators) {
    if (!Array.isArray(validators) || validators.length <= 1) {
        throw new TypeError('HelperPropTypes.and: Expected an array of 2 or more validators.');
    }

    function validate(...args) {
        let error = null;

        validators.some(validator => {
            error = validator(...args);
            return error != null;
        });

        return error == null ? null : error;
    }

    function validateIsRequired(...args) {
        let error = null;

        validators.some(validator => {
            error = validator.isRequired(...args);
            return error != null;
        });

        return error == null ? null : error;
    }

    validate.isRequired = validateIsRequired;

    return validate;
}
