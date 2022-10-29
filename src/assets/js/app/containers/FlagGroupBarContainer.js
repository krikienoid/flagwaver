import { connect } from 'react-redux';

import FlagGroupBar from '../components/FlagGroupBar';
import { setFlagGroupOptions } from '../redux/modules/flagGroup';

const mapStateToProps = state => ({
    options: state.editor.present.flagGroup
});

const mapDispatchToProps = {
    setOptions: setFlagGroupOptions
};

export default connect(mapStateToProps, mapDispatchToProps)(FlagGroupBar);
