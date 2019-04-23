import React from 'react';
import PropTypes from 'prop-types';

import withUniqueId from '../hocs/withUniqueId';

function URLInput({
    id,
    label,
    name,
    placeholder,
    buttonText,
    value,
    onChange,
    onSubmit
}) {
    return (
        <div className="form-group">
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
                    onChange={onChange}
                />

                <button
                    type="button"
                    className="input-group-btn btn btn-outline-secondary"
                    onClick={onSubmit}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

URLInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    buttonText: PropTypes.node,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
};

URLInput.defaultProps = {
    label: 'URL',
    name: 'url',
    placeholder: 'https://www...',
    buttonText: 'Go'
};

export default withUniqueId(URLInput);
