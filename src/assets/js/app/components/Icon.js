import React from 'react';
import PropTypes from 'prop-types';

function Icon({
    component: IconComponent,
    className
}) {
    return (
        <IconComponent
            className={'icon svg-icon' + (className ? ' ' + className : '')}
            attr={{
                'aria-hidden': true,
                focusable: false
            }}
        />
    );
}

Icon.propTypes = {
    component: PropTypes.elementType.isRequired,
    className: PropTypes.string
};

export default Icon;
