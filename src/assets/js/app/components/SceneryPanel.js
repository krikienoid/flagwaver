import PropTypes from 'prop-types';

import { SceneryBackground } from '../constants';
import ColorPickerInput from '../components/ColorPickerInput';
import FilePickerInput from '../components/FilePickerInput';
import Select from '../components/Select';
import debounce from '../utils/debounce';

function SceneryPanel({ options, setOptions }) {
    const handleChange = (e) => {
        setOptions({
            [e.target.name]: e.target.value
        });
    };

    const handleColorPickerChange = (value) => {
        setOptions({
            backgroundColor: value
        });
    };

    const handleFilePickerChange = (name, value) => {
        setOptions({
            [name]: value
        });
    };

    const handleColorPickerChangeDebounced = debounce(handleColorPickerChange);

    return (
        <div className="form-section">
            <Select
                label="Background"
                name="background"
                value={options.background}
                onChange={handleChange}
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
                    onChange={handleColorPickerChangeDebounced}
                />
            ) : null}

            {options.background === SceneryBackground.CUSTOM ? (
                <FilePickerInput
                    label="Background image"
                    name="backgroundImageSrc"
                    value={options.backgroundImageSrc}
                    accept="image/*"
                    onChange={handleFilePickerChange}
                    isValidFileType={type => type.match('image.*')}
                />
            ) : null}
        </div>
    );
}

SceneryPanel.propTypes = {
    options: PropTypes.object.isRequired,
    setOptions: PropTypes.func
};

SceneryPanel.defaultProps = {
    setOptions: () => {}
};

export default SceneryPanel;
