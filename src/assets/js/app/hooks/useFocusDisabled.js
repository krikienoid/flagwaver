import { tabbable } from 'tabbable';
import { useEffect, useRef } from 'react';

const disableFocus = (elems) => {
    for (let i = 0, ii = elems.length; i < ii; i++) {
        const elem = elems[i];
        const defaultTabIndex = elem.getAttribute('tabindex');

        elem.setAttribute('tabindex', '-1');

        if (defaultTabIndex) {
            elem.setAttribute('data-tabindex', defaultTabIndex);
        }
    }
};

const enableFocus = (elems) => {
    for (let i = 0, ii = elems.length; i < ii; i++) {
        const elem = elems[i];
        const defaultTabIndex = elem.getAttribute('data-tabindex');

        elem.removeAttribute('tabindex');

        if (defaultTabIndex) {
            elem.setAttribute('tabindex', defaultTabIndex);
            elem.removeAttribute('data-tabindex');
        }
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
