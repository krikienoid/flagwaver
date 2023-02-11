import PropTypes from 'prop-types';
import { MdRedo, MdRefresh, MdUndo } from 'react-icons/md';

import Icon from '../components/Icon';

function ActionsPanel({
    editor,
    resetApp,
    undo,
    redo
}) {
    const canUndo = editor.past.length > 0;
    const canRedo = editor.future.length > 0;

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

                <div className="btn-group">
                    <button
                        type="button"
                        className="btn"
                        title="Undo"
                        disabled={!canUndo}
                        onClick={() => {
                            if (canUndo) {
                                undo();
                            }
                        }}
                    >
                        <Icon component={MdUndo} />
                        <span className="sr-only">Undo</span>
                    </button>

                    <button
                        type="button"
                        className="btn"
                        title="Redo"
                        disabled={!canRedo}
                        onClick={() => {
                            if (canRedo) {
                                redo();
                            }
                        }}
                    >
                        <Icon component={MdRedo} />
                        <span className="sr-only">Redo</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

ActionsPanel.propTypes = {
    editor: PropTypes.object.isRequired,
    resetApp: PropTypes.func,
    undo: PropTypes.func,
    redo: PropTypes.func
};

ActionsPanel.defaultProps = {
    resetApp: () => {},
    undo: () => {},
    redo: () => {}
};

export default ActionsPanel;
