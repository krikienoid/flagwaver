import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';

import FocusDisabled from '../components/FocusDisabled';
import Toast from '../components/Toast';

function Toasts({ toasts, removeToast }) {
    const itemRefs = useRef(new Map()).current;

    const setItemRef = id => (elem) => {
        elem !== null ? itemRefs.set(id, elem) : itemRefs.delete(id);
    };

    const transitions = useTransition(toasts, toast => toast.id, {
        from: {
            height: 0,
            transform: 'translate3d(22rem, 0, 0)'
        },
        enter: (item) => {
            return (next) => {
                return next({
                    height: itemRefs.get(item.id).offsetHeight
                })
                    .then(() => {
                        next({
                            transform: 'translate3d(0, 0, 0)'
                        });
                    });
            };
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
                {transitions.map(({ item: toast, props: style, key }) => {
                    const { id, message, ...props } = toast;

                    const disabled = !toasts.some(toast => toast.id === id);

                    return (
                        <animated.li key={key} style={style}>
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
