import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormGroup from '../components/FormGroup';
import withUniqueId from '../hocs/withUniqueId';
import { fileRecordPropType } from '../types';
import prettyPrintBytes from '../utils/prettyPrintBytes';

class FileInput extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.node,
        name: PropTypes.string,
        value: fileRecordPropType,
        accept: PropTypes.string,
        defaultText: PropTypes.node,
        disabled: PropTypes.bool,
        buttonText: PropTypes.node,
        validator: PropTypes.func,
        onChange: PropTypes.func,
        isValidFileType: PropTypes.func
    };

    static defaultProps = {
        label: 'File',
        defaultText: 'Select file...',
        disabled: false,
        buttonText: 'Browse...',
        validator: () => ({ valid: true }),
        onChange: () => {},
        isValidFileType: () => true
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        if (!(window.File && window.FileReader)) {
            console.error(
                'The File APIs are not fully supported in this browser.'
            );

            return;
        }

        const { name, onChange, isValidFileType } = this.props;

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

        onChange(name, {
            url: window.URL.createObjectURL(file),
            type: file.type.split('/')[0],
            file: file
        });
    }

    render () {
        const {
            id,
            label,
            name,
            value,
            accept,
            defaultText,
            disabled,
            buttonText,
            validator
        } = this.props;

        const { valid, feedback } = validator(value);
        const feedbackId = feedback ? `${id}-feedback` : null;

        const file = value && value.file || null;

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
                        onChange={this.handleChange}
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
}

export default withUniqueId(FileInput);
