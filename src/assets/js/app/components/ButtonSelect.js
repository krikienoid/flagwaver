import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';

function ButtonSelect({
    id: propsId,
    label,
    name,
    value,
    options,
    disabled,
    block,
    buttonClassName,
    buttonActiveClassName,
    validator,
    onChange
}) {
    const id = useUniqueId(propsId);

    const { valid, feedback } = validator(value);
    const feedbackId = feedback ? `${id}-feedback` : null;
    const optionGroupName = `${id}-options`;

    return (
        <FormGroup {...{ valid, feedback, feedbackId }}>
            <fieldset className={'btn-select' + (block ? ' ' + 'btn-select-block' : '')}>
                <legend className="form-label">
                    {label}
                </legend>

                <div className="btn-select-options">
                    {options.map((option, i) => {
                        const { label: optionLabel, value: optionValue } = option;

                        const optionId = `${id}-option-${i + 1}`;
                        const checked = optionValue === value;

                        return (
                            <div key={optionValue} className="btn-select-option">
                                <input
                                    type="radio"
                                    id={optionId}
                                    name={optionGroupName}
                                    value={optionValue}
                                    checked={checked}
                                    disabled={disabled}
                                    onChange={() => {
                                        onChange(name, optionValue);
                                    }}
                                />

                                <label
                                    className={buttonClassName + (checked ? ' ' + buttonActiveClassName : '')}
                                    htmlFor={optionId}
                                >
                                    {optionLabel}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>
        </FormGroup>
    );
}

ButtonSelect.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string.isRequired
    })),
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    buttonClassName: PropTypes.string,
    buttonActiveClassName: PropTypes.string,
    validator: PropTypes.func,
    onChange: PropTypes.func
};

ButtonSelect.defaultProps = {
    label: 'Select',
    options: [],
    disabled: false,
    buttonClassName: 'btn',
    buttonActiveClassName: 'active',
    validator: () => ({ valid: true }),
    onChange: () => {}
};

export default ButtonSelect;
