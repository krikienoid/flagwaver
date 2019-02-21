import { Component } from 'react';
import PropTypes from 'prop-types';

import { WindModule } from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

class Wind extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { app } = this.props;

        this.module = new WindModule();

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
        const { app, options } = this.props;

        if (module) {
            module.setOptions({
                speed: options.enabled ? options.speed : 0.001
            });

            app.needsUpdate = true;
        }
    }

    render() {
        return null;
    }
}

export default withAppContext(Wind);
