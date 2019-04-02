import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SliderInput from '../components/SliderInput';
import SwitchInput from '../components/SwitchInput';
import withUniqueId from '../hocs/withUniqueId';

class WindPane extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
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
        const { id, options } = this.props;

        return (
            <div className="form-section">
                <SwitchInput
                    id={`${id}-enabled-input`}
                    label="Wind"
                    name="enabled"
                    value={options.enabled}
                    onChange={this.handleSwitchChange}
                />

                <SliderInput
                    id={`${id}-direction`}
                    label="Direction"
                    name="direction"
                    value={options.direction}
                    min={0}
                    max={360}
                    onChange={this.handleChange}
                />

                <SliderInput
                    id={`${id}-speed`}
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

export default withUniqueId(WindPane);
