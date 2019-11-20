import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePickerInput from '../components/FilePickerInput';
import Message from '../components/Message';
import { fileRecordPropType } from '../types';

export default class FlagGroupBar extends Component {
    static propTypes = {
        fileRecord: fileRecordPropType,
        options: PropTypes.object,
        setFileRecord: PropTypes.func,
        setOptions: PropTypes.func
    };

    static defaultProps = {
        setFileRecord: () => {},
        setOptions: () => {}
    };

    constructor(props) {
        super(props);

        this.handleFilePickerChange = this.handleFilePickerChange.bind(this);
        this.handleFilePickerLoad = this.handleFilePickerLoad.bind(this);
    }

    handleFilePickerChange(name, value) {
        this.props.setFileRecord(value);
    }

    handleFilePickerLoad(name, value) {
        this.props.setOptions({ imageSrc: value.url });
    }

    render() {
        const { fileRecord, options } = this.props;

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
                    value={fileRecord}
                    accept="image/*"
                    onChange={this.handleFilePickerChange}
                    onLoad={this.handleFilePickerLoad}
                    isValidFileType={type => type.match('image.*')}
                />
            </div>
        );
    }
}
