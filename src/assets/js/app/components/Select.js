import React from 'react';
import PropTypes from 'prop-types';

import withUniqueId from '../hocs/withUniqueId';

function Select({
    id,
    label,
    name,
    value,
    options,
    disabled,
    onChange
}) {
    return (
        <div className="form-group">
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <select
                className="form-select"
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                onChange={onChange}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
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
    onChange: PropTypes.func
};

Select.defaultProps = {
    label: 'Select',
    name: 'select',
    options: [],
    disabled: false
};

export default withUniqueId(Select);
