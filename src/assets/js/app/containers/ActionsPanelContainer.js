import { connect } from 'react-redux';

import ActionsPanel from '../components/ActionsPanel';
import { resetApp } from '../redux/modules/root';

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
    resetApp
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanel);
