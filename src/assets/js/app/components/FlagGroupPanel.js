import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MdFlag } from 'react-icons/md';

import ButtonSelect from '../components/ButtonSelect';
import FilePickerInput from '../components/FilePickerInput';
import Icon from '../components/Icon';
import Message from '../components/Message';
import Select from '../components/Select';
import { fileRecordPropType } from '../types';

export default class FlagGroupPanel extends Component {
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
        this.handleButtonSelectChange = this.handleButtonSelectChange.bind(this);
        this.handleFilePickerChange = this.handleFilePickerChange.bind(this);
        this.handleFilePickerLoad = this.handleFilePickerLoad.bind(this);
    }

    handleChange(e) {
        this.props.setOptions({
            [e.target.name]: e.target.value
        });
    }

    handleButtonSelectChange(name, value) {
        this.props.setOptions({
            [name]: value
        });
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

                <hr />

                <ButtonSelect
                    label="Hoisting"
                    name="hoisting"
                    value={options.hoisting}
                    options={[
                        {
                            value: 'sinister',
                            label: (
                                <Fragment>
                                    <Icon component={MdFlag} className="icon-hoisting-sinister" />
                                    <span className="btn-text">Sinister</span>
                                </Fragment>
                            )
                        },
                        {
                            value: 'dexter',
                            label: (
                                <Fragment>
                                    <Icon component={MdFlag} className="icon-hoisting-dexter" />
                                    <span className="btn-text">Dexter</span>
                                </Fragment>
                            )
                        }
                    ]}
                    block
                    onChange={this.handleButtonSelectChange}
                />

                <Select
                    label="Orientation"
                    name="orientation"
                    value={options.orientation}
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
