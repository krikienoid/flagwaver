import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SceneryBackground } from '../constants';
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
                            value: SceneryBackground.CLASSIC,
                            label: 'Classic'
                        },
                        {
                            value: SceneryBackground.BLUE_SKY,
                            label: 'Blue sky'
                        },
                        {
                            value: SceneryBackground.NIGHT_SKY_CLOUDS,
                            label: 'Night sky with clouds'
                        }
                    ]}
                />
            </div>
        );
    }
}
