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

        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleSliderChange(e) {
        this.props.setOptions({
            [e.target.name]: Number(e.target.value)
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
                    outputSuffix="&deg;"
                    ticks={[
                        {
                            label: (<span aria-label="North">N</span>),
                            value: 0
                        },
                        {
                            label: (<span aria-label="East">E</span>),
                            value: 90
                        },
                        {
                            label: (<span aria-label="South">S</span>),
                            value: 180
                        },
                        {
                            label: (<span aria-label="West">W</span>),
                            value: 270
                        }
                    ]}
                    onChange={this.handleSliderChange}
                />

                <SliderInput
                    label="Speed"
                    name="speed"
                    value={options.speed}
                    min={0}
                    max={2000}
                    onChange={this.handleSliderChange}
                />
            </div>
        );
    }
}
