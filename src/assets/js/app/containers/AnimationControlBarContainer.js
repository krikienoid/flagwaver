import { connect } from 'react-redux';

import AnimationControlBar from '../components/AnimationControlBar';
import { setMuted, setPaused } from '../redux/modules/animationControl';

const mapStateToProps = state => ({
    muted: state.animationControl.muted,
    paused: state.animationControl.paused
});

const mapDispatchToProps = {
    setMuted: setMuted,
    setPaused: setPaused
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnimationControlBar);
