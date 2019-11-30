import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import SliderInput from '../components/SliderInput';
import SwitchInput from '../components/SwitchInput';

function ShortLabel({ symbol, text }) {
    return (
        <Fragment>
            <span aria-hidden="true">{symbol}</span>
            <span className="sr-only">{text}</span>
        </Fragment>
    );
}

export default class WindPanel extends Component {
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

    handleSliderChange(name, value) {
        this.props.setOptions({
            [name]: Number(value)
        });
    }

    handleSwitchChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.checked
        });
    }

    render() {
        const { options } = this.props;

        const controllable = options.enabled && options.controlled;

        return (
            <div className="form-section">
                <SwitchInput
                    label="Wind"
                    name="enabled"
                    value={options.enabled}
                    onChange={this.handleSwitchChange}
                />

                <SwitchInput
                    label="Wind control"
                    name="controlled"
                    value={options.controlled}
                    disabled={!options.enabled}
                    onChange={this.handleSwitchChange}
                />

                <SliderInput
                    label="Direction"
                    name="direction"
                    value={options.direction}
                    min={0}
                    max={360}
                    outputSuffix="&deg;"
                    ticksLabel="Select cardinal direction"
                    ticks={[
                        {
                            label: (<ShortLabel symbol="N" text="North" />),
                            value: 0
                        },
                        {
                            label: (<ShortLabel symbol="E" text="East" />),
                            value: 90
                        },
                        {
                            label: (<ShortLabel symbol="S" text="South" />),
                            value: 180
                        },
                        {
                            label: (<ShortLabel symbol="W" text="West" />),
                            value: 270
                        }
                    ]}
                    disabled={!controllable}
                    onChange={this.handleSliderChange}
                />

                <SliderInput
                    label="Speed"
                    name="speed"
                    value={options.speed}
                    min={0}
                    max={30}
                    outputSuffix=" m/s"
                    disabled={!controllable}
                    onChange={this.handleSliderChange}
                />
            </div>
        );
    }
}
