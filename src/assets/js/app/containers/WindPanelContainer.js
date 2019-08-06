import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WindPanel from '../components/WindPanel';
import { setWindOptions } from '../redux/modules/wind';

const mapStateToProps = state => ({
    options: state.wind
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setOptions: setWindOptions
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(WindPanel);
