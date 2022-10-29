import { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MdArrowForward, MdDelete, MdFolderOpen } from 'react-icons/md';

import ButtonSelect from '../components/ButtonSelect';
import FileInput from '../components/FileInput';
import Icon from '../components/Icon';
import URLInput from '../components/URLInput';
import { getObject, createObjectURL, revokeObjectURL } from '../utils/BlobUtils';
import { isURL } from '../utils/Validators';

const FilePickerInputMode = {
    WEB: 'web',
    FILE: 'file'
};

function FilePickerInput({
    label,
    name,
    value,
    accept,
    onChange,
    isValidFileType
}) {
    const [inputMode, setInputMode] = useState(FilePickerInputMode.WEB);
    const [url, setURL] = useState('');
    const [hasSubmittedURL, setHasSubmittedURL] = useState(false);

    const prevValue = useRef('');

    const validateURL = (value) => {
        return (
            (hasSubmittedURL && (!value || !isURL(value)))
                ? {
                    valid: false,
                    feedback: 'Please enter a valid URL.'
                }
                : { valid: true }
        );
    };

    const handleModeChange = (name, value) => {
        setInputMode(value);
        setHasSubmittedURL(false);
    };

    const handleURLChange = (e) => {
        setURL(e.target.value);
        setHasSubmittedURL(false);
    };

    const handleURLSubmit = () => {
        setHasSubmittedURL(true);

        if (!url || isURL(url)) {
            onChange(name, url);
        }
    };

    const handleFileChange = (inputName, file) => {
        setURL('');

        onChange(name, createObjectURL(file));
    };

    const handleReset = () => {
        setURL('');
        setHasSubmittedURL(false);

        onChange(name, '');
    };

    const updateURL = (value) => {
        setURL(value && !getObject(value) ? value : '');
    };

    useEffect(() => {
        revokeObjectURL(prevValue.current);

        prevValue.current = value;

        updateURL(value);
    }, [value]);

    return (
        <div className="form-group form-file-picker">
            <fieldset className="field-group">
                <legend className="field-group-legend">
                    {label}
                </legend>

                <div className="field-group-body">
                    <ButtonSelect
                        label="From"
                        name="inputMode"
                        value={inputMode}
                        options={[
                            {
                                label: 'Web',
                                value: FilePickerInputMode.WEB
                            },
                            {
                                label: 'File',
                                value: FilePickerInputMode.FILE
                            }
                        ]}
                        block
                        onChange={handleModeChange}
                    />

                    {inputMode === FilePickerInputMode.WEB && (
                        <URLInput
                            label="URL"
                            name="url"
                            value={url}
                            buttonText={(
                                <Fragment>
                                    <Icon component={MdArrowForward} />
                                    <span className="sr-only">Submit</span>
                                </Fragment>
                            )}
                            validator={validateURL}
                            onChange={handleURLChange}
                            onSubmit={handleURLSubmit}
                        />
                    )}

                    {inputMode === FilePickerInputMode.FILE && (
                        <FileInput
                            label="File"
                            name="file"
                            value={getObject(value)}
                            accept={accept}
                            defaultText="Select file..."
                            buttonText={(
                                <Fragment>
                                    <Icon component={MdFolderOpen} />
                                    <span className="sr-only">Browse</span>
                                </Fragment>
                            )}
                            onChange={handleFileChange}
                            isValidFileType={isValidFileType}
                        />
                    )}

                    <div className="form-group form-file-picker-footer">
                        <button
                            type="button"
                            className="btn"
                            onClick={handleReset}
                        >
                            <Icon component={MdDelete} />
                            <span className="btn-text">Clear</span>
                        </button>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

FilePickerInput.propTypes = {
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.string,
    accept: PropTypes.string,
    onChange: PropTypes.func,
    isValidFileType: PropTypes.func
};

FilePickerInput.defaultProps = {
    label: 'Select File',
    onChange: () => {}
};

export default FilePickerInput;
