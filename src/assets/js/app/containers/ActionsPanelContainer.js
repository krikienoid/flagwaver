import { connect } from 'react-redux';

import ActionsPanel from '../components/ActionsPanel';
import { resetApp, undo, redo } from '../redux/modules/editor';

const mapStateToProps = state => ({
    editor: state.editor
});

const mapDispatchToProps = {
    resetApp,
    undo,
    redo
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanel);
