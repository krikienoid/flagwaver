import React, { Component, useState } from 'react';

import uniqueId from '../utils/uniqueId';

function useUniqueId(propId) {
    const [id, setId] = useState(propId);

    if (!id) {
        const uid = uniqueId('uid-');

        setId(uid);

        return uid;
    }

    return id;
}

export default function withUniqueId(WrappedComponent) {
    return (props) => {
        const id = useUniqueId(props.id);

        return (
            <WrappedComponent {...props} id={id} />
        );
    };
}
