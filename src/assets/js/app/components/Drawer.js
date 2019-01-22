import React from 'react';
import PropTypes from 'prop-types';

function DrawerButton({
    className,
    openClassName,
    target,
    open,
    onClick,
    children
}) {
    return (
        <button
            type="button"
            className={className + (open ? ' ' + openClassName : '')}
            aria-controls={target}
            aria-expanded={open}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

DrawerButton.propTypes = {
    className: PropTypes.string,
    openClassName: PropTypes.string,
    target: PropTypes.string,
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
    id,
    className,
    openClassName,
    open,
    children
}) {
    return (
        <div
            id={id}
            className={className + (open ? ' ' + openClassName : '')}
            aria-hidden={open}
        >
            {children}
        </div>
    );
}

Drawer.propTypes = {
    id: PropTypes.string,
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
