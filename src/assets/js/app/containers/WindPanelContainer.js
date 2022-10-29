import { connect } from 'react-redux';

import WindPanel from '../components/WindPanel';
import { setWindOptions } from '../redux/modules/wind';

const mapStateToProps = state => ({
    options: state.wind
});

const mapDispatchToProps = {
    setOptions: setWindOptions
};

export default connect(mapStateToProps, mapDispatchToProps)(WindPanel);
