import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WindBar from '../components/WindBar';
import { setWindOptions } from '../redux/modules/wind';

const mapStateToProps = state => ({
    options: state.wind
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setOptions: setWindOptions
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(WindBar);
