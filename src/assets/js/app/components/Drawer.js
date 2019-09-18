import React from 'react';
import PropTypes from 'prop-types';

function DrawerButton({
    className,
    openClassName,
    open,
    onClick,
    children
}) {
    return (
        <button
            type="button"
            className={className + (open ? ' ' + openClassName : '')}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

DrawerButton.propTypes = {
    className: PropTypes.string,
    openClassName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    children: PropTypes.node
};

DrawerButton.defaultProps = {
    className: 'drawer-btn',
    openClassName: 'open'
};

function DrawerOverlay({
    className,
    openClassName,
    open,
    onClick
}) {
    return (
        <div
            className={className + (open ? ' ' + openClassName : '')}
            onClick={onClick}
        ></div>
    );
}

DrawerOverlay.propTypes = {
    className: PropTypes.string,
    openClassName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};

DrawerOverlay.defaultProps = {
    className: 'drawer-overlay',
    openClassName: 'open'
};

function Drawer({
    className,
    openClassName,
    open,
    children
}) {
    return (
        <div
            className={className + (open ? ' ' + openClassName : '')}
            aria-hidden={!open}
        >
            {children}
        </div>
    );
}

Drawer.propTypes = {
    className: PropTypes.string,
    openClassName: PropTypes.string,
    open: PropTypes.bool.isRequired,
    children: PropTypes.node
};

Drawer.defaultProps = {
    className: 'drawer',
    openClassName: 'open'
};

Drawer.Button = DrawerButton;
Drawer.Overlay = DrawerOverlay;

export default Drawer;
