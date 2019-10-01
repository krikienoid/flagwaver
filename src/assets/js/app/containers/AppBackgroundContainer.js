import { connect } from 'react-redux';

import AppBackground from '../components/AppBackground';

const mapStateToProps = state => ({
    options: state.scenery
});

export default connect(mapStateToProps)(AppBackground);
