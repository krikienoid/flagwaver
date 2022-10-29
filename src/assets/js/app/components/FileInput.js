import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import useUniqueId from '../hooks/useUniqueId';
import prettyPrintBytes from '../utils/prettyPrintBytes';

function FileInput({
    id: propsId,
    label,
    name,
    value,
    accept,
    defaultText,
    disabled,
    buttonText,
    validator,
    onChange,
    isValidFileType
}) {
    const id = useUniqueId(propsId);

    const { valid, feedback } = validator(value);
    const feedbackId = feedback ? `${id}-feedback` : null;

    const file = value || null;

    const handleChange = (e) => {
        if (!window.File) {
            console.error(
                'The File APIs are not fully supported in this browser.'
            );

            return;
        }

        const file = e.target.files[0];

        if (!file) {
            console.error(
                'No file was uploaded.'
            );

            return;
        }

        if (!isValidFileType(file.type)) {
            console.error(
                'Invalid file type.'
            );

            return;
        }

        onChange(name, file);
    };

    return (
        <FormGroup {...{ valid, feedback, feedbackId }}>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <div className="form-file">
                <input
                    type="file"
                    className="form-file-input"
                    id={id}
                    name={name}
                    accept={accept}
                    disabled={disabled}
                    aria-describedby={feedbackId}
                    onChange={handleChange}
                />

                <div className="input-group form-file-btn" aria-hidden="true">
                    <input
                        type="text"
                        className="form-input"
                        value={file ? file.name : ''}
                        placeholder={defaultText}
                        disabled="disabled"
                    />

                    <div className="btn input-group-btn">
                        {buttonText}
                    </div>
                </div>
            </div>
        </FormGroup>
    );
}

FileInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.instanceOf(File),
    accept: PropTypes.string,
    defaultText: PropTypes.node,
    disabled: PropTypes.bool,
    buttonText: PropTypes.node,
    validator: PropTypes.func,
    onChange: PropTypes.func,
    isValidFileType: PropTypes.func
};

FileInput.defaultProps = {
    label: 'File',
    defaultText: 'Select file...',
    disabled: false,
    buttonText: 'Browse...',
    validator: () => ({ valid: true }),
    onChange: () => {},
    isValidFileType: () => true
};

export default FileInput;
