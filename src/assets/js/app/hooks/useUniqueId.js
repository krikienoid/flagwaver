import { useState } from 'react';

import uniqueId from '../utils/uniqueId';

export default function useUniqueId(propsId) {
    const [id, setId] = useState(propsId);

    if (!id) {
        const newId = uniqueId('uid-');

        setId(newId);

        return newId;
    }

    return id;
}
