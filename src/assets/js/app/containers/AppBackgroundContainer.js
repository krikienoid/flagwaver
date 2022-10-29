import { connect } from 'react-redux';

import AppBackground from '../components/AppBackground';
import { addToast } from '../redux/modules/toasts';

const mapStateToProps = state => ({
    options: state.scenery
});

const mapDispatchToProps = {
    addToast: addToast
};

export default connect(mapStateToProps, mapDispatchToProps)(AppBackground);
