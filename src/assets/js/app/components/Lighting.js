import { Component } from 'react';
import PropTypes from 'prop-types';

import { SceneryBackground } from '../constants';
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
        const { app, options } = this.props;
        const { scene } = app;

        this.lights.map((light) => { scene.remove(light); });

        switch (options.background) {
            case SceneryBackground.BLUE_SKY:
                this.lights = createDaytimeLights();
                break;

            case SceneryBackground.NIGHT_SKY_CLOUDS:
                this.lights = createNighttimeLights();
                break;

            case SceneryBackground.CLASSIC:
            default:
                this.lights = createMutedLights();
                break;
        }

        this.lights.map((light) => { scene.add(light); });

        app.render();
    }

    render() {
        return null;
    }
}

export default withAppContext(Lighting);
