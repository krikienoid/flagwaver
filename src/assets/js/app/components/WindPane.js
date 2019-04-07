import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SliderInput from '../components/SliderInput';
import SwitchInput from '../components/SwitchInput';

export default class WindPane extends Component {
    static propTypes = {
        options: PropTypes.object.isRequired,
        setOptions: PropTypes.func
    };

    static defaultProps = {
        setOptions: () => {}
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.value
        });
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

                <SliderInput
                    label="Direction"
                    name="direction"
                    value={options.direction}
                    min={0}
                    max={360}
                    onChange={this.handleChange}
                />

                <SliderInput
                    label="Speed"
                    name="speed"
                    value={options.speed}
                    min={0}
                    max={2000}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}
