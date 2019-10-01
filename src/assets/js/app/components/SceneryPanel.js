import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from '../components/Select';

export default class SceneryPanel extends Component {
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
    }

    handleChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { options } = this.props;

        return (
            <div className="form-section">
                <Select
                    label="Background"
                    name="background"
                    value={options.background}
                    onChange={this.handleChange}
                    options={[
                        {
                            value: 'classic',
                            label: 'Classic'
                        },
                        {
                            value: 'blue-sky',
                            label: 'Blue sky'
                        },
                        {
                            value: 'night-sky-clouds',
                            label: 'Night sky with clouds'
                        }
                    ]}
                />
            </div>
        );
    }
}
