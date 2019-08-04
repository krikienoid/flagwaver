import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FlagGroup from '../components/FlagGroup';
import { addToast } from '../redux/modules/toasts';

const mapStateToProps = state => ({
    options: state.flagGroup
});

const matchDispatchToProps = dispatch => bindActionCreators({
    addToast: addToast
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(FlagGroup);
