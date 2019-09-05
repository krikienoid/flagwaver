import tabbable from 'tabbable';
import { useEffect, useRef } from 'react';

const disableFocus = (elems) => {
    for (let i = 0, ii = elems.length; i < ii; i++) {
        elems[i].setAttribute('tabindex', '-1');
    }
};

const enableFocus = (elems) => {
    for (let i = 0, ii = elems.length; i < ii; i++) {
        elems[i].removeAttribute('tabindex');
    }
};

export default function useFocusDisabled(elem, disabled) {
    const tabbableElemRefs = useRef([]);

    useEffect(() => {
        if (elem) {
            if (disabled) {
                tabbableElemRefs.current = tabbable(elem);

                disableFocus(tabbableElemRefs.current);
            } else {
                enableFocus(tabbableElemRefs.current);
            }
        }
    }, [elem, disabled]);
}
