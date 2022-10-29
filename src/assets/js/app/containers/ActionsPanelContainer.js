import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ActionsPanel from '../components/ActionsPanel';
import { resetApp } from '../redux/modules/root';

const mapStateToProps = state => ({
});

const matchDispatchToProps = dispatch => bindActionCreators({
    resetApp
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(ActionsPanel);
