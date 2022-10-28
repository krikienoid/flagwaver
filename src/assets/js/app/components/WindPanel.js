import { Fragment } from 'react';
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

function WindPanel({ options, setOptions }) {
    const handleSliderChange = (name, value) => {
        setOptions({
            [name]: Number(value)
        });
    };

    const handleSwitchChange = (e) => {
        setOptions({
            [e.target.name]: e.target.checked
        });
    };

    const controllable = options.enabled && options.controlled;

    return (
        <div className="form-section">
            <SwitchInput
                label="Wind"
                name="enabled"
                value={options.enabled}
                onChange={handleSwitchChange}
            />

            <SwitchInput
                label="Wind control"
                name="controlled"
                value={options.controlled}
                disabled={!options.enabled}
                onChange={handleSwitchChange}
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
                onChange={handleSliderChange}
            />

            <SliderInput
                label="Speed"
                name="speed"
                value={options.speed}
                min={0}
                max={30}
                outputSuffix=" m/s"
                disabled={!controllable}
                onChange={handleSliderChange}
            />
        </div>
    );
}

WindPanel.propTypes = {
    options: PropTypes.object.isRequired,
    setOptions: PropTypes.func
};

WindPanel.defaultProps = {
    setOptions: () => {}
};

export default WindPanel;
