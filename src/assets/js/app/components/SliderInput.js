import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withUniqueId from '../hocs/withUniqueId';

class SliderInput extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.node,
        name: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.oneOf(['any'])
        ]),
        outputPrefix: PropTypes.string,
        outputSuffix: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        label: 'Slider',
        name: 'slider',
        min: 0,
        max: 100,
        step: 1,
        outputPrefix: '',
        outputSuffix: ''
    };

    render() {
        const {
            id,
            label,
            name,
            value,
            min,
            max,
            step,
            outputPrefix,
            outputSuffix,
            onChange
        } = this.props;

        return (
            <div className="form-group">
                <label className="form-label" htmlFor={id}>
                    {label}
                </label>

                <div className="form-static">
                    {outputPrefix}

                    <output htmlFor={id}>{value}</output>

                    {outputSuffix}
                </div>

                <input
                    type="range"
                    className="slider"
                    id={id}
                    name={name}
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={onChange}
                />
            </div>
        );
    }
}

export default withUniqueId(SliderInput);
