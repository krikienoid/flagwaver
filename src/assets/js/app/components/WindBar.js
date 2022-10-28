import PropTypes from 'prop-types';

import SwitchInput from '../components/SwitchInput';

function WindBar({ options, setOptions }) {
    const handleSwitchChange = (e) => {
        setOptions({
            [e.target.name]: e.target.checked
        });
    };

    return (
        <div className="form-section">
            <SwitchInput
                label="Wind"
                name="enabled"
                value={options.enabled}
                onChange={handleSwitchChange}
            />
        </div>
    );
}

WindBar.propTypes = {
    options: PropTypes.object.isRequired,
    setOptions: PropTypes.func
};

WindBar.defaultProps = {
    setOptions: () => {}
};

export default WindBar;
