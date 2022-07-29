import PropTypes from 'prop-types';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import useUniqueId from '../hooks/useUniqueId';

function ColorPickerInput({
    id: propsId,
    label,
    name,
    value,
    onChange
}) {
    const id = useUniqueId(propsId);
    const inputId = `${id}-input`;

    return (
        <div className="form-group">
            <fieldset className="field-group">
                <legend className="field-group-legend">
                    {label}
                </legend>

                <div className="field-group-body">
                    <div className="form-group">
                        <HexColorPicker
                            color={value}
                            onChange={onChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor={inputId}>
                            Hex
                        </label>

                        <HexColorInput
                            className="form-input"
                            id={inputId}
                            name={name}
                            color={value}
                            onChange={onChange}
                        />
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

ColorPickerInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

ColorPickerInput.defaultProps = {
    label: 'Color'
};

export default ColorPickerInput;
