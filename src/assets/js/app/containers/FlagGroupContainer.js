import { connect } from 'react-redux';

import FlagGroup from '../components/FlagGroup';
import { addToast } from '../redux/modules/toasts';

const mapStateToProps = state => ({
    options: state.flagGroup
});

const mapDispatchToProps = {
    addToast: addToast
};

export default connect(mapStateToProps, mapDispatchToProps)(FlagGroup);
