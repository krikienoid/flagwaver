import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withUniqueId from '../hocs/withUniqueId';

class SwitchInput extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.node,
        name: PropTypes.string,
        value: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        label: 'Switch',
        name: 'switch'
    };

    render() {
        const { id, label, name, value, onChange } = this.props;

        return (
            <div className="form-group">
                <div className="form-switch">
                    <input
                        type="checkbox"
                        className="checkbox"
                        id={id}
                        name={name}
                        checked={value}
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
}

export default withUniqueId(SwitchInput);
