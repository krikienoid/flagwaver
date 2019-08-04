import React from 'react';
import PropTypes from 'prop-types';

const MessageStatus = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
};

function Message({ status, children }) {
    return (
        <div className={`message message-${status}`}>
            <div className="message-body">
                {children}
            </div>
        </div>
    );
}

Message.propTypes = {
    status: PropTypes.oneOf([
        MessageStatus.DEFAULT,
        MessageStatus.SUCCESS,
        MessageStatus.WARNING,
        MessageStatus.ERROR
    ]),
    children: PropTypes.node.isRequired
};

Message.defaultProps = {
    status: MessageStatus.DEFAULT
};

export default Message;
