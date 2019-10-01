import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SceneryPanel from '../components/SceneryPanel';
import { setSceneryOptions } from '../redux/modules/scenery';

const mapStateToProps = state => ({
    options: state.scenery
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setOptions: setSceneryOptions
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(SceneryPanel);
