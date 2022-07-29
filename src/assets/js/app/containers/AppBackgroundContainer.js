import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppBackground from '../components/AppBackground';
import { addToast } from '../redux/modules/toasts';

const mapStateToProps = state => ({
    options: state.scenery
});

const matchDispatchToProps = dispatch => bindActionCreators({
    addToast: addToast
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(AppBackground);
