import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SwitchInput from '../components/SwitchInput';
import withUniqueId from '../hocs/withUniqueId';

class WindBar extends Component {
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

        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleSwitchChange(e) {
        this.props.setOptions({ enabled: e.target.checked });
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
            </div>
        );
    }
}

export default withUniqueId(WindBar);
