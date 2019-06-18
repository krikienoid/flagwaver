import React from 'react';
import PropTypes from 'prop-types';

import Toast from '../components/Toast';

function Toasts({ toasts, removeToast }) {
    return (
        <div role="alert" aria-live="assertive" aria-atomic="true">
            <ul className="toasts">
                {toasts.map(toast => {
                    const { id, message, ...props } = toast;

                    return (
                        <li key={id}>
                            <Toast {...props} onDismissClick={() => { removeToast(id); }}>
                                <p>{message}</p>
                            </Toast>
                        </li>
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
