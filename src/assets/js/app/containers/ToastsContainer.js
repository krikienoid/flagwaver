import { connect } from 'react-redux';

import Toasts from '../components/Toasts';
import { removeToast } from '../redux/modules/toasts';

const mapStateToProps = state => ({
    toasts: state.toasts
});

const mapDispatchToProps = {
    removeToast: removeToast
};

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
