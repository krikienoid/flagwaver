import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Toasts from '../components/Toasts';
import { removeToast } from '../redux/modules/toasts';

const mapStateToProps = state => ({
    toasts: state.toasts
});

const matchDispatchToProps = dispatch => bindActionCreators({
    removeToast: removeToast
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Toasts);
