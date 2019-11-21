import { Component } from 'react';
import PropTypes from 'prop-types';

import withAppContext from '../hocs/withAppContext';
import {
    createMutedLights,
    createDaytimeLights,
    createNighttimeLights
} from '../scene/LightingHelpers';

class Lighting extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.lights = [];

        this.renderModule();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.options !== this.props.options) {
            this.renderModule();
        }
    }

    componentWillUnmount() {
        const { scene } = this.props.app;

        this.lights.map((light) => { scene.remove(light); });
    }

    renderModule() {
        const { options } = this.props;
        const { scene } = this.props.app;

        this.lights.map((light) => { scene.remove(light); });

        switch (options.background) {
            case 'blue-sky':
                this.lights = createDaytimeLights();
                break;

            case 'night-sky-clouds':
                this.lights = createNighttimeLights();
                break;

            case 'classic':
            default:
                this.lights = createMutedLights();
                break;
        }

        this.lights.map((light) => { scene.add(light); });
    }

    render() {
        return null;
    }
}

export default withAppContext(Lighting);
