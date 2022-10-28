import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { SceneryBackground } from '../constants';
import withAppContext from '../hocs/withAppContext';
import {
    createMutedLights,
    createDaytimeLights,
    createNighttimeLights
} from '../scene/LightingHelpers';

function Lighting({ app, options }) {
    const { scene } = app;

    const lights = useRef([]);

    const renderModule = () => {
        lights.current.map((light) => { scene.remove(light); });

        switch (options.background) {
            case SceneryBackground.BLUE_SKY:
                lights.current = createDaytimeLights();
                break;

            case SceneryBackground.NIGHT_SKY_CLOUDS:
                lights.current = createNighttimeLights();
                break;

            case SceneryBackground.CLASSIC:
            default:
                lights.current = createMutedLights();
                break;
        }

        lights.current.map((light) => { scene.add(light); });

        app.render();
    };

    useEffect(() => {
        lights.current = [];

        renderModule();

        return () => {
            lights.current.map((light) => { scene.remove(light); });
        };
    }, []);

    useEffect(() => {
        renderModule();
    }, [options]);

    return null;
}

Lighting.propTypes = {
    app: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired
};

export default withAppContext(Lighting);
