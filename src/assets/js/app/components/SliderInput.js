import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';

function SliderInput({
    id: propsId,
    label,
    name,
    value,
    min,
    max,
    step,
    disabled,
    outputPrefix,
    outputSuffix,
    ticksLabel,
    ticks,
    validator,
    onChange
}) {
    const id = useUniqueId(propsId);

    const { valid, feedback } = validator(value);
    const feedbackId = feedback ? `${id}-feedback` : null;
    const tickGroupName = `${id}-ticks`;

    const handleChange = (e) => {
        onChange(name, e.target.value);
    };

    return (
        <FormGroup {...{ valid, feedback, feedbackId }}>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <div className={'form-static' + (disabled ? ' ' + 'disabled' : '')}>
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
                disabled={disabled}
                aria-describedby={feedbackId}
                onChange={handleChange}
            />

            {(ticks && ticks.length) ? (
                <fieldset className="form-group" disabled={disabled}>
                    <legend className="sr-only">
                        <span className="sr-only">
                            {ticksLabel}
                        </span>
                    </legend>

                    <ul className="slider-ticks">
                        {ticks.map(({ label: tickLabel, value: tickValue }) => (
                            <li key={tickValue}>
                                <input
                                    type="radio"
                                    id={`${id}-tick-${tickValue}`}
                                    name={tickGroupName}
                                    value={tickValue}
                                    checked={value === tickValue}
                                    disabled={disabled}
                                    onChange={handleChange}
                                />

                                <label htmlFor={`${id}-tick-${tickValue}`}>
                                    {tickLabel}
                                </label>
                            </li>
                        ))}
                    </ul>
                </fieldset>
            ) : null}
        </FormGroup>
    );
}

SliderInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['any'])
    ]),
    disabled: PropTypes.bool,
    outputPrefix: PropTypes.string,
    outputSuffix: PropTypes.string,
    ticksLabel: PropTypes.node,
    ticks: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.number.isRequired
    })),
    validator: PropTypes.func,
    onChange: PropTypes.func
};

SliderInput.defaultProps = {
    label: 'Slider',
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    outputPrefix: '',
    outputSuffix: '',
    ticksLabel: 'Select position',
    ticks: [],
    validator: () => ({ valid: true }),
    onChange: () => {}
};

export default SliderInput;
