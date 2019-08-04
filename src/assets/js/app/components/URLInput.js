import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';

function URLInput({
    id: propsId,
    label,
    name,
    placeholder,
    buttonText,
    value,
    disabled,
    validator,
    onChange,
    onSubmit
}) {
    const id = useUniqueId(propsId);

    const { valid, feedback } = validator(value);
    const feedbackId = feedback ? `${id}-feedback` : null;

    return (
        <FormGroup {...{ valid, feedback, feedbackId }}>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <div className="input-group">
                <input
                    type="url"
                    className="form-input"
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-describedby={feedbackId}
                    onChange={onChange}
                />

                <button
                    type="button"
                    className="input-group-btn btn btn-outline-secondary"
                    disabled={disabled}
                    onClick={onSubmit}
                >
                    {buttonText}
                </button>
            </div>
        </FormGroup>
    );
}

URLInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    buttonText: PropTypes.node,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    validator: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
};

URLInput.defaultProps = {
    label: 'URL',
    name: 'url',
    placeholder: 'https://www...',
    buttonText: 'Go',
    disabled: false,
    validator: () => ({ valid: true })
};

export default URLInput;
