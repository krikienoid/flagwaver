import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimationControlBar from '../components/AnimationControlBar';
import { setMuted, setPaused } from '../redux/modules/animationControl';

const mapStateToProps = state => ({
    muted: state.animationControl.muted,
    paused: state.animationControl.paused
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setMuted: setMuted,
    setPaused: setPaused
}, dispatch);

export default connect(
    mapStateToProps,
    matchDispatchToProps
)(AnimationControlBar);
