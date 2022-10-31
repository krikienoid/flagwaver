import { connect } from 'react-redux';

import Wind from '../components/Wind';

const mapStateToProps = state => ({
    options: state.editor.present.wind
});

export default connect(mapStateToProps)(Wind);
