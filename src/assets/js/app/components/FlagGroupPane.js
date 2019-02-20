import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePickerInput from '../components/FilePickerInput';
import withUniqueId from '../hocs/withUniqueId';
import { fileRecordPropType } from '../types';

class FlagGroupPane extends Component {
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

        this.handleChange = this.handleChange.bind(this);
        this.handleFilePickerChange = this.handleFilePickerChange.bind(this);
        this.handleFilePickerLoad = this.handleFilePickerLoad.bind(this);
    }

    handleChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.value
        });
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

                <hr />

                <div className="form-group">
                    <label className="form-label" htmlFor={`${id}-hoisting-select`}>
                        Hoisting
                    </label>

                    <select
                        className="form-select"
                        id={`${id}-hoisting-select`}
                        name="hoisting"
                        value={options.hoisting}
                        onChange={this.handleChange}
                    >
                        <option value="dexter">Dexter</option>
                        <option value="sinister">Sinister</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor={`${id}-orientation-select`}>
                        Orientation
                    </label>

                    <select
                        className="form-select"
                        id={`${id}-orientation-select`}
                        name="topEdge"
                        value={options.topEdge}
                        onChange={this.handleChange}
                    >
                        <option value="top">Top</option>
                        <option value="left">Left</option>
                        <option value="bottom">Bottom</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>
        );
    }
}

export default withUniqueId(FlagGroupPane);
