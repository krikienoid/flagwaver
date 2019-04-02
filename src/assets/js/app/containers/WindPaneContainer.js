import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WindPane from '../components/WindPane';
import { setWindOptions } from '../redux/modules/wind';

const mapStateToProps = state => ({
    options: state.wind
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setOptions: setWindOptions
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(WindPane);
