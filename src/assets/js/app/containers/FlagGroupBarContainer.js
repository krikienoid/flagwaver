import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FlagGroupBar from '../components/FlagGroupBar';
import { setFileRecord } from '../redux/modules/fileRecord';
import { setFlagGroupOptions } from '../redux/modules/flagGroup';

const mapStateToProps = state => ({
    fileRecord: state.fileRecord,
    options: state.flagGroup
});

const matchDispatchToProps = dispatch => bindActionCreators({
    setFileRecord: setFileRecord,
    setOptions: setFlagGroupOptions
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(FlagGroupBar);
