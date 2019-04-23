import React from 'react';
import PropTypes from 'prop-types';

import withUniqueId from '../hocs/withUniqueId';

function SwitchInput({ id, label, name, value, disabled, onChange }) {
    return (
        <div className="form-group">
            <div className="form-switch">
                <input
                    type="checkbox"
                    className="checkbox"
                    id={id}
                    name={name}
                    checked={value}
                    disabled={disabled}
                    onChange={onChange}
                />

                <span className="form-icon" aria-hidden="true"></span>

                <label htmlFor={id}>
                    {label}

                    <div className="form-icon-target"></div>
                </label>
            </div>
        </div>
    );
}

SwitchInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

SwitchInput.defaultProps = {
    label: 'Switch',
    name: 'switch',
    disabled: false
};

export default withUniqueId(SwitchInput);
