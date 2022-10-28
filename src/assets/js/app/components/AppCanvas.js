import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import withAppContext from '../hocs/withAppContext';

function AppCanvas({ app }) {
    const ref = useRef(null);

    useEffect(() => {
        app.canvas.setAttribute('role', 'img');
        app.canvas.setAttribute('aria-label', 'Animation view');

        ref.current.appendChild(app.canvas);

        app.module('resizeModule').resize();

        return () => {
            ref.current.removeChild(this.props.app.canvas);
        };
    }, []);

    return (
        <div ref={ref} className="app-canvas"></div>
    );
}

AppCanvas.propTypes = {
    app: PropTypes.object.isRequired
};

export default withAppContext(AppCanvas);
