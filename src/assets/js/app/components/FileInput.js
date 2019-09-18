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
        onLoad: PropTypes.func,
        isValidFileType: PropTypes.func
    };

    static defaultProps = {
        label: 'File',
        defaultText: 'Select file...',
        disabled: false,
        buttonText: 'Browse...',
        validator: () => ({ valid: true }),
        onChange: () => {},
        onLoad: () => {},
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

        const { name, onChange, onLoad, isValidFileType } = this.props;

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
            url: '',
            file: file
        });

        const reader = new FileReader();

        reader.addEventListener('load', (e) => {
            onLoad(name, {
                url: e.target.result,
                file: file
            });
        });

        reader.readAsDataURL(file);
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
