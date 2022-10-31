import { connect } from 'react-redux';

import FlagGroupPanel from '../components/FlagGroupPanel';
import { setFlagGroupOptions } from '../redux/modules/flagGroup';

const mapStateToProps = state => ({
    options: state.editor.present.flagGroup
});

const mapDispatchToProps = {
    setOptions: setFlagGroupOptions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FlagGroupPanel);
