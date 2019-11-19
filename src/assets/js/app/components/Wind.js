import { Component } from 'react';
import PropTypes from 'prop-types';
import THREE from 'three';

import {
    Wind as WindSubject,
    WindModule,
    WindModifiers
} from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

const yAxis = new THREE.Vector3(0, -1, 0);

function getDirectionVector(deg) {
    const v = new THREE.Vector3(0, 0, 1);
    return v.applyAxisAngle(yAxis, deg * Math.PI / 180);
}

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
        this.props.app.remove(this.module);
    }

    renderModule() {
        const { app, options } = this.props;

        app.remove(this.module);

        this.module = new WindModule({
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

        app.add(this.module);
        app.needsUpdate = true;
    }

    render() {
        return null;
    }
}

export default withAppContext(Wind);
