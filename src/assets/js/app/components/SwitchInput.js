import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import withUniqueId from '../hocs/withUniqueId';

function SwitchInput({
    id,
    label,
    name,
    value,
    disabled,
    validator,
    onChange
}) {
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

                    <div className="form-icon-target"></div>
                </label>
            </div>
        </FormGroup>
    );
}

SwitchInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    validator: PropTypes.func,
    onChange: PropTypes.func
};

SwitchInput.defaultProps = {
    label: 'Switch',
    name: 'switch',
    disabled: false,
    validator: () => ({ valid: true })
};

export default withUniqueId(SwitchInput);
