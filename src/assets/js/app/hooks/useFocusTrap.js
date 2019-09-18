import createFocusTrap from 'focus-trap';
import { useEffect, useRef } from 'react';

export default function useFocusTrap(elem, active, options = {}) {
    const focusTrapRef = useRef(null);

    useEffect(() => {
        if (elem) {
            if (active) {
                if (!focusTrapRef.current) {
                    focusTrapRef.current = createFocusTrap(elem, options);
                }

                focusTrapRef.current.activate();
            } else {
                if (focusTrapRef.current) {
                    focusTrapRef.current.deactivate();
                }
            }
        }
    }, [elem, active]);
}
