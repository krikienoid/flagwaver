import { Component } from 'react';
import PropTypes from 'prop-types';

import { FlagGroupModule } from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

const DEFAULT_FLAG_SRC = './assets/img/NZ.2b.png';

class FlagGroup extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { app } = this.props;

        this.module = new FlagGroupModule();

        app.add(this.module);
        app.needsUpdate = true;

        this.renderModule();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.options !== this.props.options) {
            this.renderModule();
        }
    }

    componentWillUnmount() {
        if (this.module) {
            this.props.app.remove(this.module);
        }
    }

    renderModule() {
        const module = this.module;
        const { options } = this.props;

        if (module) {
            module.subject.setFlagOptions(Object.assign({}, options, {
                imgSrc: options.imgSrc || DEFAULT_FLAG_SRC
            }));
        }
    }

    render() {
        return null;
    }
}

export default withAppContext(FlagGroup);
