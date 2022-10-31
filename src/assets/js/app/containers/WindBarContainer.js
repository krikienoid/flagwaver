import { connect } from 'react-redux';

import WindBar from '../components/WindBar';
import { setWindOptions } from '../redux/modules/wind';

const mapStateToProps = state => ({
    options: state.editor.present.wind
});

const mapDispatchToProps = {
    setOptions: setWindOptions
};

export default connect(mapStateToProps, mapDispatchToProps)(WindBar);
