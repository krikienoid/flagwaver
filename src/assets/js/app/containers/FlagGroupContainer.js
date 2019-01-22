import { connect } from 'react-redux';

import FlagGroup from '../components/FlagGroup';

const mapStateToProps = state => ({
    options: state.flagGroup
});

export default connect(mapStateToProps)(FlagGroup);
