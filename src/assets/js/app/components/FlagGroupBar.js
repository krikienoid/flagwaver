import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePickerInput from '../components/FilePickerInput';
import withUniqueId from '../hocs/withUniqueId';
import { fileRecordPropType } from '../types';

class FlagGroupBar extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
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

    handleFilePickerChange(value) {
        this.props.setFileRecord(value);
    }

    handleFilePickerLoad(value) {
        this.props.setOptions({ imgSrc: value.url });
    }

    render() {
        const { id, fileRecord, options } = this.props;

        if (!options) {
            return (
                <div className="alert error">
                    <p>Error: Object does not exist.</p>
                </div>
            );
        }

        return (
            <div className="form-section">
                <FilePickerInput
                    id={`${id}-image-filepicker`}
                    label="Select Image"
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

export default withUniqueId(FlagGroupBar);
