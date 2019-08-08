import React from 'react';
import PropTypes from 'prop-types';

function Icon({ component: IconComponent }) {
    return (
        <IconComponent className="icon svg-icon" attr={{
            'aria-hidden': true,
            focusable: false
        }} />
    );
}

Icon.propTypes = {
    component: PropTypes.elementType.isRequired
};

export default Icon;
