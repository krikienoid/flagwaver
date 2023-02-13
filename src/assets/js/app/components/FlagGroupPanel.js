import { Fragment } from 'react';
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
import SwitchInput from '../components/SwitchInput';

function FlagGroupPanel({ options, setOptions }) {
    const handleChange = (e) => {
        setOptions({
            [e.target.name]: e.target.value
        });
    };

    const handleButtonSelectChange = (name, value) => {
        setOptions({
            [name]: value
        });
    };

    const handleFilePickerChange = (name, value) => {
        setOptions({
            [name]: value
        });
    };

    const handleSwitchChange = (e) => {
        setOptions({
            [e.target.name]: e.target.checked
        });
    };

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
                name="imageSrc"
                value={options.imageSrc}
                accept="image/*, video/*"
                onChange={handleFilePickerChange}
                isValidFileType={type =>
                    type.match('image.*') || type.match('video.*')}
            />

            <SwitchInput
                label="Two-sided"
                name="isTwoSided"
                value={options.isTwoSided}
                disabled={!options.imageSrc}
                onChange={handleSwitchChange}
            />

            {options.isTwoSided ? (
                <FilePickerInput
                    label="Select back side image"
                    name="backSideImageSrc"
                    value={options.backSideImageSrc}
                    accept="image/*, video/*"
                    onChange={handleFilePickerChange}
                    isValidFileType={type =>
                        type.match('image.*') || type.match('video.*')}
                />
            ) : null}

            <ButtonSelect
                label="Hoisting"
                name="hoisting"
                value={options.hoisting}
                options={[
                    {
                        value: Hoisting.SINISTER,
                        label: (
                            <Fragment>
                                <Icon
                                    component={MdFlag}
                                    className="icon-hoisting-sinister"
                                />
                                <span className="btn-text">Sinister</span>
                            </Fragment>
                        )
                    },
                    {
                        value: Hoisting.DEXTER,
                        label: (
                            <Fragment>
                                <Icon
                                    component={MdFlag}
                                    className="icon-hoisting-dexter"
                                />
                                <span className="btn-text">Dexter</span>
                            </Fragment>
                        )
                    }
                ]}
                block
                onChange={handleButtonSelectChange}
            />

            <Select
                label="Orientation"
                name="orientation"
                value={options.orientation}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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

FlagGroupPanel.propTypes = {
    options: PropTypes.object.isRequired,
    setOptions: PropTypes.func
};

FlagGroupPanel.defaultProps = {
    setOptions: () => {}
};

export default FlagGroupPanel;
