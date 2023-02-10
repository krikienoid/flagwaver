import PropTypes from 'prop-types';

function DrawerButton({
    className,
    openClassName,
    open,
    onClick,
    children,
    ...props
}) {
    return (
        <button
            type="button"
            className={className + (open ? ' ' + openClassName : '')}
            onClick={onClick}
            {...props}
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
    onClick,
    ...props
}) {
    return (
        <div
            className={className + (open ? ' ' + openClassName : '')}
            onClick={onClick}
            {...props}
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
    children,
    ...props
}) {
    return (
        <div
            className={className + (open ? ' ' + openClassName : '')}
            aria-hidden={!open}
            {...props}
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
