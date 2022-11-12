import Modernizr from 'modernizr';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
    MdClose,
    MdArrowDropDown,
    MdArrowDropUp,
    MdFullscreen,
    MdFullscreenExit,
    MdOutlineCenterFocusWeak,
    MdOutlineSettingsOverscan
} from 'react-icons/md';

import { fromHash } from '../globals/HashStore';
import initApp from '../globals/initApp';
import setLoadedClass from '../globals/setLoadedClass';
import AboutPanel from '../components/AboutPanel';
import AppCanvas from '../components/AppCanvas';
import AppModules from '../components/AppModules';
import CameraControlPanel from '../components/CameraControlPanel';
import Drawer from '../components/Drawer';
import FocusDisabled from '../components/FocusDisabled';
import FocusTrap from '../components/FocusTrap';
import Icon from '../components/Icon';
import Panel from '../components/Panel';
import ActionsPanelContainer from '../containers/ActionsPanelContainer';
import AnimationControlBarContainer
    from '../containers/AnimationControlBarContainer';
import AppBackgroundContainer from '../containers/AppBackgroundContainer';
import FlagGroupBarContainer from '../containers/FlagGroupBarContainer';
import FlagGroupPanelContainer from '../containers/FlagGroupPanelContainer';
import SceneryPanelContainer from '../containers/SceneryPanelContainer';
import ToastsContainer from '../containers/ToastsContainer';
import WindBarContainer from '../containers/WindBarContainer';
import WindPanelContainer from '../containers/WindPanelContainer';
import AppContext from '../contexts/AppContext';
import withWebGLBrowserTest from '../hocs/withWebGLBrowserTest';
import useForceUpdate from '../hooks/useForceUpdate';
import store from '../redux/store';

const SITE_HEADLINE_INVERSE_IMAGE_PATH = `${process.env.ROOT_URL}/${
    Modernizr.svgasimg
        ? 'assets/img/site-headline-inverse.svg'
        : 'assets/img/site-headline-inverse.png'
}`;

const AppMode = {
    EDIT: 'edit',
    ANIMATE: 'animate',
    CAMERA: 'camera',
    ABOUT: 'about'
};

const navItems = [
    {
        key: AppMode.EDIT,
        displayName: 'Flag'
    },
    {
        key: AppMode.ANIMATE,
        displayName: 'Animation control'
    },
    {
        key: AppMode.CAMERA,
        displayName: 'Camera control'
    },
    {
        key: AppMode.ABOUT,
        displayName: 'About'
    }
];

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [appMode, setAppMode] = useState(AppMode.EDIT);
    const [isUIVisible, setIsUIVisible] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const app = useRef(null);
    const drawerModalRef = useRef(null);

    const forceUpdate = useForceUpdate();

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const openNav = () => {
        setIsNavOpen(true);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    const selectAppMode = (appMode) => {
        setAppMode(appMode);
        setIsNavOpen(false);
    };

    const resetCamera = () => {
        const { orbitControls } = app.current.module('orbitControlsModule');

        orbitControls.reset();
    };

    const toggleUIVisibility = () => {
        setIsUIVisible(!isUIVisible);
    };

    const toggleFullscreen = () => {
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
            const el = document.documentElement;

            if (el.requestFullscreen) {
                el.requestFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleHashChange = () => {
            fromHash(store);
        };

        app.current = initApp();
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        forceUpdate();
        setLoadedClass();

        return () => {
            app.current.destroy();
            app.current = null;
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key || e.keyCode;

            if (!isUIVisible) {
                if (
                    key === 'Enter' || key === 13 ||
                    key === ' ' || key === 32 ||
                    key === 'Escape' || key === 27
                ) {
                    setIsUIVisible(true);

                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isUIVisible]);

    return (
        <AppContext.Provider value={app.current}>
            <AppModules />

            <div
                className={`site-wrapper ${isUIVisible ? 'site-mode-ui-visible' : 'site-mode-ui-hidden'}`}
                aria-hidden={isDrawerOpen}
            >
                <header className="site-header" role="banner">
                    <div className="site-header-layout">
                        <div className="site-header-center">
                            <h1 className="site-headline">
                                <img
                                    width="189"
                                    height="48"
                                    alt="FlagWaver"
                                    src={SITE_HEADLINE_INVERSE_IMAGE_PATH}
                                />
                            </h1>
                        </div>

                        <div className="site-header-left">
                            <Drawer.Button
                                className="site-header-btn drawer-btn"
                                open={isDrawerOpen}
                                onClick={toggleDrawer}
                            >
                                <span className="icon icon-bars" aria-hidden="true">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </span>

                                <span className="sr-only">Open drawer</span>
                            </Drawer.Button>
                        </div>

                        <div className="site-header-right">
                            <button type="button" className="site-header-btn">
                                <span className="icon icon-dots" aria-hidden="true">
                                    <span className="icon-dot"></span>
                                    <span className="icon-dot"></span>
                                    <span className="icon-dot"></span>
                                </span>

                                <span className="sr-only">Options</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="site-main" role="main">
                    <div className="app-viewer">
                        <AppBackgroundContainer />

                        <AppCanvas />
                    </div>

                    <section className="bottom-app-bar" aria-label="Toolbar">
                        {(
                            appMode === AppMode.EDIT ||
                            appMode === AppMode.ABOUT
                        ) ? (
                            <Fragment>
                                <div className="bottom-app-bar-primary">
                                    <FlagGroupBarContainer />
                                </div>

                                <div className="bottom-app-bar-secondary">
                                    <WindBarContainer />
                                </div>

                                <div className="bottom-app-bar-tertiary">
                                    <div className="form-section">
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={openDrawer}
                                        >
                                            All options
                                        </button>
                                    </div>
                                </div>
                            </Fragment>
                        ) : (appMode === AppMode.ANIMATE) ? (
                            <div className="bottom-app-bar-primary">
                                <AnimationControlBarContainer />
                            </div>
                        ) : (appMode === AppMode.CAMERA) ? (
                            <div className="bottom-app-bar-primary">
                            </div>
                        ) : null}

                        <div className="bottom-app-bar-quaternary">
                            <div className="form-section">
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={resetCamera}
                                    >
                                        <Icon component={MdOutlineCenterFocusWeak} />
                                        <span className="sr-only">
                                            Reset camera
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn site-mode-ui-visibility-toggle-btn"
                                        onClick={toggleUIVisibility}
                                    >
                                        <div className="site-mode-ui-visibility-toggle-btn-overlay"></div>
                                        <Icon component={MdOutlineSettingsOverscan} />
                                        <span className="sr-only">
                                            {isUIVisible ? 'Hide interface' : 'Show interface'}
                                        </span>
                                    </button>

                                    {document.fullscreenEnabled ? (
                                        <button
                                            type="button"
                                            className="btn site-mode-fullscreen-toggle-btn"
                                            onClick={toggleFullscreen}
                                        >
                                            {isFullscreen ? (
                                                <Fragment>
                                                    <Icon component={MdFullscreenExit} />
                                                    <span className="sr-only">Exit fullscreen mode</span>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <Icon component={MdFullscreen} />
                                                    <span className="sr-only">Enter fullscreen mode</span>
                                                </Fragment>
                                            )}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <FocusTrap
                active={isDrawerOpen}
                focusTrapOptions={{
                    onDeactivate: closeDrawer,
                    initialFocus: drawerModalRef.current
                }}
            >
                <div>
                    <Drawer.Overlay
                        open={isDrawerOpen}
                        onClick={closeDrawer}
                    />

                    <Drawer open={isDrawerOpen}>
                        <FocusDisabled disabled={!isDrawerOpen}>
                            <section
                                ref={drawerModalRef}
                                className="focusable-wrap"
                                tabIndex="-1"
                                role="dialog"
                                aria-label="Drawer"
                            >
                                <div className="panel-navbar">
                                    <div className="panel-navbar-layout">
                                        <div className="panel-navbar-left">
                                            {isNavOpen ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-link"
                                                    onClick={closeNav}
                                                >
                                                    <Icon component={MdArrowDropUp} />
                                                    <span className="btn-text" aria-hidden="true">Menu</span>
                                                    <span className="sr-only">Close menu</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-link"
                                                    onClick={openNav}
                                                >
                                                    <Icon component={MdArrowDropDown} />
                                                    <span className="btn-text" aria-hidden="true">Menu</span>
                                                    <span className="sr-only">Open menu</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="panel-navbar-right">
                                            <Drawer.Button
                                                className="btn btn-link"
                                                open={isDrawerOpen}
                                                onClick={closeDrawer}
                                            >
                                                <Icon component={MdClose} />
                                                <span className="sr-only">Close drawer</span>
                                            </Drawer.Button>
                                        </div>
                                    </div>
                                </div>

                                {isNavOpen ? (
                                    <section className="panel">
                                        <div className="panel-nav">
                                            <h2 className="sr-only">Menu</h2>

                                            <ul className="nav">
                                                {navItems.map(({ key, displayName }) => (
                                                    <li
                                                        key={key}
                                                        className={'nav-item' + (appMode === key ? ' ' + 'active' : '')}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="link"
                                                            onClick={() => { selectAppMode(key); }}
                                                        >
                                                            {displayName}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>
                                ) : (appMode === AppMode.EDIT) ? (
                                    <Fragment>
                                        <Panel title="Flag">
                                            <FlagGroupPanelContainer />
                                        </Panel>

                                        <Panel title="Wind">
                                            <WindPanelContainer />
                                        </Panel>

                                        <Panel title="Scenery">
                                            <SceneryPanelContainer />
                                        </Panel>

                                        <Panel title="Actions">
                                            <ActionsPanelContainer />
                                        </Panel>
                                    </Fragment>
                                ) : (appMode === AppMode.ANIMATE) ? (
                                    <Panel title="Animation control">
                                        <AnimationControlBarContainer />
                                    </Panel>
                                ) : (appMode === AppMode.CAMERA) ? (
                                    <Panel title="Camera control">
                                        <CameraControlPanel />
                                    </Panel>
                                ) : (appMode === AppMode.ABOUT) ? (
                                    <Panel title={(
                                        <Fragment>
                                            FlagWaver
                                            <small>{process.env.VERSION}</small>
                                        </Fragment>
                                    )}>
                                        <AboutPanel />
                                    </Panel>
                                ) : null}
                            </section>
                        </FocusDisabled>
                    </Drawer>

                    <ToastsContainer />
                </div>
            </FocusTrap>
        </AppContext.Provider>
    );
}

export default withWebGLBrowserTest(App);
