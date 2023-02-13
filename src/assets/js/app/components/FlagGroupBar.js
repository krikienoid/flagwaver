import PropTypes from 'prop-types';

import FilePickerInput from '../components/FilePickerInput';
import Message from '../components/Message';

function FlagGroupBar({ options, setOptions }) {
    const handleFilePickerChange = (name, value) => {
        setOptions({
            [name]: value
        });
    };

    if (!options) {
        return (
            <Message status="error">
                <p>Error: Object does not exist.</p>
            </Message>
        );
    }

    return (
        <div className="form-section">
            <FilePickerInput
                label="Select image"
                name="imageSrc"
                value={options.imageSrc}
                accept="image/*, video/*"
                onChange={handleFilePickerChange}
                isValidFileType={type =>
                    type.match('image.*') || type.match('video.*')}
            />
        </div>
    );
}

FlagGroupBar.propTypes = {
    options: PropTypes.object.isRequired,
    setOptions: PropTypes.func
};

FlagGroupBar.defaultProps = {
    setOptions: () => {}
};

export default FlagGroupBar;
