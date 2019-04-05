import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import HelperPropTypes from '../utils/HelperPropTypes';

/*
 * Accessible radio button group
 *
 * Based on these examples:
 * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/radio/radio-1/radio-1.html
 * https://dequeuniversity.com/library/aria/custom-controls/sf-checkboxes-radios
 */

const Direction = {
    LTR: 'ltr',
    RTL: 'rtl'
};

function nextInCycle(array, i) {
    const next = i + 1;

    if (next < array.length) {
        return array[next];
    } else {
        return array[0];
    }
}

function prevInCycle(array, i) {
    const prev = i - 1;

    if (prev >= 0) {
        return array[prev];
    } else {
        return array[array.length - 1];
    }
}

function findDuplicates(array) {
    const result = [];

    array.forEach((item, i) => {
        // If duplicate exists
        if (array.indexOf(item, i + 1) !== -1) {
            // Add to result if not already added
            if (result.indexOf(item) === -1) {
                result.push(item);
            }
        }
    });

    return result;
}

class ButtonSelectButton extends Component {
    render() {
        const { value, ...attributes } = this.props;

        return (
            <button type="button" role="radio" {...attributes}></button>
        );
    }
}

export default class ButtonSelect extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        className: PropTypes.string,
        direction: PropTypes.oneOf([Direction.LTR, Direction.RTL]),
        label: PropTypes.node,
        value: PropTypes.string,
        onChange: PropTypes.func,
        labelClassName: PropTypes.string,
        buttonGroupClassName: PropTypes.string,
        buttonClassName: PropTypes.string,
        buttonSelectedClassName: PropTypes.string,
        options: HelperPropTypes.and([
            PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.node,
                value: PropTypes.string.isRequired
            })),
            function (props, propName, componentName) {
                // Disallow duplicate values
                const values = props[propName].map(option => option.value);

                if (findDuplicates(values).length) {
                    return new Error(
                        '`' + componentName + '` contains one or more options with the same value.'
                    );
                }
            }
        ])
    };

    static defaultProps = {
        className: 'form-group',
        direction: Direction.LTR,
        label: 'Please Select',
        value: '',
        onChange: () => {},
        labelClassName: 'form-label',
        buttonGroupClassName: 'btn-group',
        buttonClassName: 'btn',
        buttonSelectedClassName: 'selected',
        options: []
    };

    constructor(props) {
        super(props);

        this.setButtonRef = this.setButtonRef.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.buttonRefs = [];
    }

    setButtonRef(node) {
        this.buttonRefs.push(node);
    }

    setValue(value) {
        this.setState({ value: value }, () => {
            this.props.onChange(value);
        });
    }

    findButtonRef(elem) {
        return this.buttonRefs.find(node => findDOMNode(node) === elem);
    }

    findButtonRefByValue(value) {
        return this.buttonRefs.find(node => node.props.value === value);
    }

    handleClick(e) {
        const node = this.findButtonRef(e.target);

        if (node) {
            this.setValue(node.props.value);
        }
    }

    handleKeyDown(e) {
        if (e.defaultPrevented) {
            return;
        }

        const key = e.key || e.keyCode;

        const keyLeft = key === 'ArrowLeft' || key === 'Left' || key === 37;
        const keyUp = key === 'ArrowUp' || key === 'Up' || key === 38;
        const keyRight = key === 'ArrowRight' || key === 'Right' || key === 39;
        const keyDown = key === 'ArrowDown' || key === 'Down' || key === 40;
        const keyEnter = key === 'Enter' || key === 13;
        const keySpace = key === ' ' || key === 'Spacebar' || key === 32;

        if (keyLeft || keyUp || keyRight || keyDown || keyEnter || keySpace) {
            const { options, direction } = this.props;

            const rtl = direction === Direction.RTL;
            const focusedButtonValue = this.findButtonRef(e.target).props.value;
            const i = options.findIndex(option =>
                option.value === focusedButtonValue);

            let value;

            if (keyLeft || keyUp) {
                // Select left button
                const option = rtl
                    ? nextInCycle(options, i)
                    : prevInCycle(options, i);

                value = option.value;
            } else if (keyRight || keyDown) {
                // Select right button
                const option = rtl
                    ? prevInCycle(options, i)
                    : nextInCycle(options, i);

                value = option.value;
            } else if (keyEnter || keySpace) {
                // Select focused button
                value = focusedButtonValue;
            }

            findDOMNode(this.findButtonRefByValue(value)).focus();
            this.setValue(value);

            e.preventDefault();
        }
    }

    renderButtons() {
        const {
            value: currentValue,
            buttonClassName,
            buttonSelectedClassName,
            options
        } = this.props;

        return options.map((option, i) => {
            const { label, value } = option;
            const checked = value === currentValue;

            return (
                <ButtonSelectButton
                    key={value}
                    ref={this.setButtonRef}
                    value={value}
                    className={buttonClassName + (checked ? ' ' + buttonSelectedClassName : '')}
                    tabIndex={checked || (!currentValue && !i) ? '0' : '-1'}
                    aria-checked={checked}
                    aria-posinset={i + 1}
                    aria-setsize={options.length}
                    onKeyDown={this.handleKeyDown}
                >
                    {label}
                </ButtonSelectButton>
            );
        });
    }

    render() {
        const {
            id,
            className,
            labelClassName,
            label,
            buttonGroupClassName
        } = this.props;

        const labelId = `${id}-label`;

        return (
            <div
                className={className}
                role="radiogroup"
                aria-labelledby={labelId}
            >
                <div id={labelId} className={labelClassName}>
                    {label}
                </div>

                <div
                    className={buttonGroupClassName}
                    onClick={this.handleClick}
                >
                    {this.renderButtons()}
                </div>
            </div>
        );
    }
}
