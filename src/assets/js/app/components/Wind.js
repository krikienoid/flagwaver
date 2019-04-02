import { Component } from 'react';
import PropTypes from 'prop-types';
import THREE from 'three';

import { WindModule, WindModifiers } from '../../flagwaver';
import withAppContext from '../hocs/withAppContext';

const yAxis = new THREE.Vector3(0, 1, 0);

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
        if (this.module) {
            this.props.app.remove(this.module);
        }
    }

    renderModule() {
        const module = this.module;
        const { app, options } = this.props;

        if (module) {
            module.setOptions({
                speed: options.enabled ? options.speed : 0,
                direction: getDirectionVector(options.direction),
                directionFn: WindModifiers.noEffect
            });

            app.needsUpdate = true;
        }
    }

    render() {
        return null;
    }
}

export default withAppContext(Wind);
