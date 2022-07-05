import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationControlBar from '../components/AnimationControlBar';
import { setPaused } from '../redux/modules/animationControl';

const mapStateToProps = state => ({
    paused: state.animationControl.paused
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setPaused: setPaused
}, dispatch);

export default connect(
    mapStateToProps,
    matchDispatchToProps
)(AnimationControlBar);
