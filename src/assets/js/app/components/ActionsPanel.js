import PropTypes from 'prop-types';
import { MdRefresh } from 'react-icons/md';

import Icon from '../components/Icon';

function ActionsPanel({ resetApp }) {
    return (
        <div className="form-section">
            <div className="form-group">
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn"
                        onClick={resetApp}
                    >
                        <Icon component={MdRefresh} />
                        <span className="btn-text">Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

ActionsPanel.propTypes = {
    resetApp: PropTypes.func
};

ActionsPanel.defaultProps = {
    resetApp: () => {}
};

export default ActionsPanel;
