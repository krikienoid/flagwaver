import React from 'react';
import PropTypes from 'prop-types';

const ToastStatus = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};

function Toast({ status, onDismissClick, children }) {
    return (
        <div className={`toast toast-${status}`}>
            <div className="toast-body">
                {children}
            </div>

            <button
                type="button"
                className="btn btn-clear"
                onClick={onDismissClick}
            >
                <span className="sr-only">Dismiss</span>
            </button>
        </div>
    );
}

Toast.propTypes = {
    status: PropTypes.oneOf([
        ToastStatus.DEFAULT,
        ToastStatus.SUCCESS,
        ToastStatus.WARNING,
        ToastStatus.ERROR
    ]),
    onDismissClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

Toast.defaultProps = {
    status: ToastStatus.DEFAULT
};

export default Toast;
