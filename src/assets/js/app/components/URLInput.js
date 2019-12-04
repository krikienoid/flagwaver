import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';

function URLInput({
    id: propsId,
    label,
    name,
    placeholder,
    value,
    disabled,
    buttonText,
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
                    onKeyDown={(e) => {
                        const key = e.key || e.keyCode;

                        if (key === 'Enter' || key === 13) {
                            onSubmit(e);
                        }
                    }}
                />

                <button
                    type="button"
                    className="btn input-group-btn"
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
    value: PropTypes.string,
    disabled: PropTypes.bool,
    buttonText: PropTypes.node,
    validator: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
};

URLInput.defaultProps = {
    label: 'URL',
    placeholder: 'https://www...',
    disabled: false,
    buttonText: 'Go',
    validator: () => ({ valid: true })
};

export default URLInput;
