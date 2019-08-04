import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import withUniqueId from '../hocs/withUniqueId';

function Select({
    id,
    label,
    name,
    value,
    options,
    disabled,
    validator,
    onChange
}) {
    const { valid, feedback } = validator(value);
    const feedbackId = feedback ? `${id}-feedback` : null;

    return (
        <FormGroup {...{ valid, feedback, feedbackId }}>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <select
                className="form-select"
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                aria-describedby={feedbackId}
                onChange={onChange}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </FormGroup>
    );
}

Select.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string.isRequired
    })),
    disabled: PropTypes.bool,
    validator: PropTypes.func,
    onChange: PropTypes.func
};

Select.defaultProps = {
    label: 'Select',
    name: 'select',
    options: [],
    disabled: false,
    validator: () => ({ valid: true })
};

export default withUniqueId(Select);
