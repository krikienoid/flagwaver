import React from 'react';
import PropTypes from 'prop-types';

function AppBackground({
    options
}) {
    const { background } = options;

    return (
        <div className={`app-bg bg-image-full bg-${background}`}></div>
    );
}

AppBackground.propTypes = {
    options: PropTypes.object.isRequired
};

export default AppBackground;
