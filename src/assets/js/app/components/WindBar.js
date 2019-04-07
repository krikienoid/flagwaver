import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SwitchInput from '../components/SwitchInput';

export default class WindBar extends Component {
    static propTypes = {
        options: PropTypes.object.isRequired,
        setOptions: PropTypes.func
    };

    static defaultProps = {
        setOptions: () => {}
    };

    constructor(props) {
        super(props);

        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleSwitchChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.checked
        });
    }

    render() {
        const { options } = this.props;

        return (
            <div className="form-section">
                <SwitchInput
                    label="Wind"
                    name="enabled"
                    value={options.enabled}
                    onChange={this.handleSwitchChange}
                />
            </div>
        );
    }
}
