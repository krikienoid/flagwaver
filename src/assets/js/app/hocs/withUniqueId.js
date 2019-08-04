import React from 'react';

import useUniqueId from '../hooks/useUniqueId';

export default function withUniqueId(WrappedComponent) {
    return (props) => {
        const id = useUniqueId(props.id);

        return (
            <WrappedComponent {...props} id={id} />
        );
    };
}
