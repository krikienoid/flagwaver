import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MdFlag } from 'react-icons/md';

import {
    Hoisting,
    Side,
    FlagpoleType,
    VerticalHoisting
} from '../../flagwaver';
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

                <ButtonSelect
                    label="Hoisting"
                    name="hoisting"
                    value={options.hoisting}
                    options={[
                        {
                            value: Hoisting.SINISTER,
                            label: (
                                <Fragment>
                                    <Icon component={MdFlag} className="icon-hoisting-sinister" />
                                    <span className="btn-text">Sinister</span>
                                </Fragment>
                            )
                        },
                        {
                            value: Hoisting.DEXTER,
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
                        { value: Side.TOP,    label: 'Top'    },
                        { value: Side.LEFT,   label: 'Left'   },
                        { value: Side.BOTTOM, label: 'Bottom' },
                        { value: Side.RIGHT,  label: 'Right'  }
                    ]}
                />

                <Select
                    label="Flagpole type"
                    name="flagpoleType"
                    value={options.flagpoleType}
                    onChange={this.handleChange}
                    options={[
                        {
                            value: FlagpoleType.VERTICAL,
                            label: 'Standard'
                        },
                        {
                            value: FlagpoleType.HORIZONTAL,
                            label: 'Horizontal'
                        },
                        {
                            value: FlagpoleType.OUTRIGGER,
                            label: 'Outrigger'
                        },
                        {
                            value: FlagpoleType.CROSSBAR,
                            label: 'Crossbar'
                        },
                        {
                            value: FlagpoleType.GALLERY,
                            label: 'Gallery'
                        }
                    ]}
                />

                <Select
                    label="Vertical hanging method"
                    name="verticalHoisting"
                    value={options.verticalHoisting}
                    disabled={options.flagpoleType !== FlagpoleType.CROSSBAR}
                    onChange={this.handleChange}
                    options={[
                        {
                            value: VerticalHoisting.TOP_RIGHT,
                            label: 'Rotate clockwise'
                        },
                        {
                            value: VerticalHoisting.TOP_LEFT,
                            label: 'Rotate and flip'
                        },
                        {
                            value: VerticalHoisting.NONE,
                            label: 'No change'
                        }
                    ]}
                />
            </div>
        );
    }
}
