import { Component } from 'react';
import PropTypes from 'prop-types';

import { SceneryBackground } from '../constants';
import ColorPickerInput from '../components/ColorPickerInput';
import FilePickerInput from '../components/FilePickerInput';
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
        this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
        this.handleFilePickerChange = this.handleFilePickerChange.bind(this);
    }

    handleChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.value
        });
    }

    handleColorPickerChange(value) {
        this.props.setOptions({
            backgroundColor: value
        });
    }

    handleFilePickerChange(name, value) {
        this.props.setOptions({
            backgroundImageSrc: value
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
                        },
                        {
                            value: SceneryBackground.CUSTOM,
                            label: 'Custom'
                        }
                    ]}
                />

                {options.background === SceneryBackground.CUSTOM ? (
                    <ColorPickerInput
                        label="Background color"
                        name="backgroundColor"
                        value={options.backgroundColor}
                        onChange={this.handleColorPickerChange}
                    />
                ) : null}

                {options.background === SceneryBackground.CUSTOM ? (
                    <FilePickerInput
                        label="Background image"
                        value={options.backgroundImageSrc}
                        accept="image/*"
                        onChange={this.handleFilePickerChange}
                        isValidFileType={type => type.match('image.*')}
                    />
                ) : null}
            </div>
        );
    }
}
