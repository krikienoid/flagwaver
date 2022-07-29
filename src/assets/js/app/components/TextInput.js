import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';

function TextInput({
    id: propsId,
    label,
    name,
    placeholder,
    value,
    disabled,
    validator,
    onChange
}) {
    const id = useUniqueId(propsId);

    const { valid, feedback } = validator(value);
    const feedbackId = feedback ? `${id}-feedback` : null;

    return (
        <FormGroup {...{ valid, feedback, feedbackId }}>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <input
                type="text"
                className="form-input"
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                aria-describedby={feedbackId}
                onChange={onChange}
            />
        </FormGroup>
    );
}

TextInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    validator: PropTypes.func,
    onChange: PropTypes.func
};

TextInput.defaultProps = {
    label: 'Field',
    placeholder: 'Type here...',
    disabled: false,
    validator: () => ({ valid: true })
};

export default TextInput;
