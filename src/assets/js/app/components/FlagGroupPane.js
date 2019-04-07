import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePickerInput from '../components/FilePickerInput';
import Select from '../components/Select';
import { fileRecordPropType } from '../types';

export default class FlagGroupPane extends Component {
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
        const { fileRecord, options } = this.props;

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
                    label="Select Image"
                    value={fileRecord}
                    accept="image/*"
                    onChange={this.handleFilePickerChange}
                    onLoad={this.handleFilePickerLoad}
                    isValidFileType={type => type.match('image.*')}
                />

                <hr />

                <Select
                    label="Hoisting"
                    name="hoisting"
                    value={options.hoisting}
                    onChange={this.handleChange}
                    options={[
                        { value: 'dexter', label: 'Dexter' },
                        { value: 'sinister', label: 'Sinister' }
                    ]}
                />

                <Select
                    label="Orientation"
                    name="topEdge"
                    value={options.topEdge}
                    onChange={this.handleChange}
                    options={[
                        { value: 'top',    label: 'Top'    },
                        { value: 'left',   label: 'Left'   },
                        { value: 'bottom', label: 'Bottom' },
                        { value: 'right',  label: 'Right'  }
                    ]}
                />
            </div>
        );
    }
}
