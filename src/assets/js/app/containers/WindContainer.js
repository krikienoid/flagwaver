import { connect } from 'react-redux';

import Wind from '../components/Wind';

const mapStateToProps = state => ({
    options: state.wind
});

export default connect(mapStateToProps)(Wind);
