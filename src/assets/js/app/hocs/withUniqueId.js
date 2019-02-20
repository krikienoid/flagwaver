import React from 'react';

import uniqueId from '../utils/uniqueId';

export default function withUniqueId(Component) {
    return (props) => {
        const id = props.id || uniqueId('uid-');

        return (
            <Component {...props} id={id} />
        );
    };
}
