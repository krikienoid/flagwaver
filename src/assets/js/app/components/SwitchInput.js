import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';

function SwitchInput({
    id: propsId,
    label,
    name,
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
            <div className="form-switch">
                <input
                    type="checkbox"
                    className="checkbox"
                    id={id}
                    name={name}
                    checked={value}
                    disabled={disabled}
                    aria-describedby={feedbackId}
                    onChange={onChange}
                />

                <span className="form-icon" aria-hidden="true"></span>

                <label htmlFor={id}>
                    {label}

                    <span className="form-icon-target"></span>
                </label>
            </div>
        </FormGroup>
    );
}

SwitchInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    validator: PropTypes.func,
    onChange: PropTypes.func
};

SwitchInput.defaultProps = {
    label: 'Switch',
    disabled: false,
    validator: () => ({ valid: true })
};

export default SwitchInput;
