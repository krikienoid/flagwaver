import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Vector3 } from 'three';

import {
    Wind as WindSubject,
    WindModule,
    WindModifiers
} from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

const yAxis = new Vector3(0, -1, 0);

function getDirectionVector(deg) {
    const v = new Vector3(0, 0, 1);

    return v.applyAxisAngle(yAxis, deg * Math.PI / 180);
}

function Wind({ app, options }) {
    const module = useRef();

    const renderModule = () => {
        app.remove(module.current);

        module.current = new WindModule({
            speed: options.enabled
                ? (
                    options.controlled
                        ? options.speed
                        : WindSubject.defaults.speed
                )
                : 0,
            direction: options.controlled
                ? getDirectionVector(options.direction)
                : getDirectionVector(0),
            directionFn: options.controlled
                ? WindModifiers.noEffect
                : WindModifiers.rotatingDirection
        });

        app.add(module.current);
        app.needsUpdate = true;
    };

    useEffect(() => {
        module.current = new WindModule();

        app.add(module.current);
        app.needsUpdate = true;

        renderModule();

        return () => {
            app.remove(module.current);
        };
    }, []);

    useEffect(() => {
        renderModule();
    }, [options]);

    return null;
}

Wind.propTypes = {
    app: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired
};

export default withAppContext(Wind);
