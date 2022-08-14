import { Component } from 'react';
import PropTypes from 'prop-types';

import FilePickerInput from '../components/FilePickerInput';
import Message from '../components/Message';

export default class FlagGroupBar extends Component {
    static propTypes = {
        options: PropTypes.object,
        setOptions: PropTypes.func
    };

    static defaultProps = {
        setOptions: () => {}
    };

    constructor(props) {
        super(props);

        this.handleFilePickerChange = this.handleFilePickerChange.bind(this);
    }

    handleFilePickerChange(name, value) {
        this.props.setOptions({
            imageSrc: value
        });
    }

    render() {
        const { options } = this.props;

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
                    value={options.imageSrc}
                    accept="image/*, video/*"
                    onChange={this.handleFilePickerChange}
                    isValidFileType={type => type.match('image.*') || type.match('video.*')}
                />
            </div>
        );
    }
}
