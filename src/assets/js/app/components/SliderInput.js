import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SliderInput extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.node,
        name: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        onChange: PropTypes.func
    };

    static defaultProps = {
        label: 'Slider',
        name: 'slider',
        min: 0,
        max: 100
    };

    render() {
        const { id, label, name, value, min, max, onChange } = this.props;

        return (
            <div className="form-group">
                <label className="form-label" htmlFor={id}>
                    {label}
                </label>

                <input
                    type="range"
                    className="slider tooltip"
                    id={id}
                    name={name}
                    value={value}
                    min={min}
                    max={max}
                    onChange={onChange}
                />
            </div>
        );
    }
}
