import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withAppContext from '../hocs/withAppContext';

class AppCanvas extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.setRef = this.setRef.bind(this);
        this.ref = null;
    }

    setRef(elem) {
        this.ref = elem;
    }

    componentDidMount() {
        const { app } = this.props;

        app.canvas.setAttribute('role', 'img');
        app.canvas.setAttribute('aria-label', 'View of a waving flag');

        this.ref.appendChild(app.canvas);

        app.module('resizeModule').resize();
    }

    componentWillUnmount() {
        this.ref.removeChild(this.props.app.canvas);
    }

    render() {
        return (
            <div ref={this.setRef} className="app-canvas"></div>
        );
    }
}

export default withAppContext(AppCanvas);
