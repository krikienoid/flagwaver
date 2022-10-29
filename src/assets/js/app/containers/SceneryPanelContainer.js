import { connect } from 'react-redux';

import SceneryPanel from '../components/SceneryPanel';
import { setSceneryOptions } from '../redux/modules/scenery';

const mapStateToProps = state => ({
    options: state.editor.present.scenery
});

const mapDispatchToProps = {
    setOptions: setSceneryOptions
};

export default connect(mapStateToProps, mapDispatchToProps)(SceneryPanel);
