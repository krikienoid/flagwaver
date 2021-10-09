import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';

import FocusDisabled from '../components/FocusDisabled';
import Toast from '../components/Toast';

function Toasts({ toasts, removeToast }) {
    const itemRefs = useRef(new Map()).current;

    const setItemRef = id => (elem) => {
        elem !== null ? itemRefs.set(id, elem) : itemRefs.delete(id);
    };

    const transitions = useTransition(toasts, {
        keys: toast => toast.id,
        from: {
            height: 0,
            transform: 'translate3d(22rem, 0, 0)'
        },
        enter: (item) => async (next) => {
            await next({
                height: itemRefs.get(item.id).offsetHeight
            });

            await next({
                transform: 'translate3d(0rem, 0, 0)'
            });
        },
        leave: [
            {
                transform: 'translate3d(22rem, 0, 0)'
            },
            {
                height: 0
            }
        ]
    });

    return (
        <div role="alert" aria-live="assertive" aria-atomic="true">
            <ul className="toasts">
                {transitions((style, toast) => {
                    const { id, message, ...props } = toast;

                    const disabled = !toasts.some(toast => toast.id === id);

                    return (
                        <animated.li style={style}>
                            <FocusDisabled disabled={disabled}>
                                <div ref={setItemRef(id)} className="toasts-item-wrap">
                                    <Toast {...props} onDismissClick={() => { removeToast(id); }}>
                                        <p>{message}</p>
                                    </Toast>
                                </div>
                            </FocusDisabled>
                        </animated.li>
                    );
                })}
            </ul>
        </div>
    );
}

Toasts.propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    removeToast: PropTypes.func.isRequired
};

export default Toasts;
