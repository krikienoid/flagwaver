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
import withBrowserTest from '../hocs/withBrowserTest';
import useForceUpdate from '../hooks/useForceUpdate';
import useUniqueId from '../hooks/useUniqueId';
import store from '../redux/store';

const SITE_HEADLINE_INVERSE_IMAGE_PATH = `${process.env.ROOT_URL}/assets/img/site-headline-inverse.svg`;

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
    const [isDrawerAnimating, setIsDrawerAnimating] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [appMode, setAppMode] = useState(AppMode.EDIT);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const app = useRef(null);

    const forceUpdate = useForceUpdate();
    const id = useUniqueId();

    const drawerId = `${id}-drawer`;

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

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const selectAppMode = (appMode) => {
        setAppMode(appMode);
        setIsNavOpen(false);
    };

    const resetCamera = () => {
        const { orbitControls } = app.current.module('orbitControlsModule');

        orbitControls.reset();
    };

    const toggleTheaterMode = () => {
        setIsTheaterMode(!isTheaterMode);
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

            if (isTheaterMode) {
                if (
                    key === 'Enter' || key === 13 ||
                    key === ' ' || key === 32 ||
                    key === 'Escape' || key === 27
                ) {
                    setIsTheaterMode(false);

                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTheaterMode]);

    useEffect(() => {
        const transitionDuration = 200;

        setIsDrawerAnimating(false);

        setTimeout(() => {
            setIsDrawerAnimating(true);
        }, 0);

        setTimeout(() => {
            app.current.module('resizeModule').resize();
        }, transitionDuration);

        setTimeout(() => {
            setIsDrawerAnimating(false);
        }, 2 * transitionDuration);
    }, [isDrawerOpen]);

    return (
        <AppContext.Provider value={app.current}>
            <AppModules />

            <div
                className={[
                    'site-wrapper',
                    (isDrawerOpen ? 'site-is-drawer-open' : 'site-not-drawer-open'),
                    (isDrawerAnimating ? 'site-is-drawer-animating' : ''),
                    (isTheaterMode ? 'site-is-theater-mode' : 'site-not-theater-mode')
                ].filter(a => a).join(' ')}
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
                                aria-controls={drawerId}
                                aria-expanded={isDrawerOpen}
                            >
                                <span className="icon icon-bars" aria-hidden="true">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </span>

                                <span className="sr-only">Toggle side panel</span>
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
                                            aria-controls={drawerId}
                                            onClick={openDrawer}
                                        >
                                            More options
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
                                        title="Reset camera"
                                        onClick={resetCamera}
                                    >
                                        <Icon component={MdOutlineCenterFocusWeak} />
                                        <span className="sr-only">
                                            Reset camera
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn site-theater-mode-toggle-btn"
                                        title={isTheaterMode ? '' : 'Theater mode'}
                                        onClick={toggleTheaterMode}
                                    >
                                        <div className="site-theater-mode-toggle-btn-overlay"></div>
                                        <Icon component={MdOutlineSettingsOverscan} />
                                        <span className="sr-only">
                                            {isTheaterMode ? 'Exit theater mode' : 'Theater mode'}
                                        </span>
                                    </button>

                                    {document.fullscreenEnabled ? (
                                        <button
                                            type="button"
                                            className="btn site-fullscreen-toggle-btn"
                                            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                                            onClick={toggleFullscreen}
                                        >
                                            <Icon component={isFullscreen ? MdFullscreenExit : MdFullscreen} />
                                            <span className="sr-only">
                                                {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                                            </span>
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <Drawer id={drawerId} open={isDrawerOpen}>
                <FocusDisabled disabled={!isDrawerOpen}>
                    <section
                        className="drawer-layout focusable-wrap"
                        aria-label="Side panel"
                    >
                        <div className="drawer-header">
                            <div className="drawer-header-layout">
                                <div className="drawer-header-left">
                                    <button
                                        type="button"
                                        className="btn btn-link"
                                        onClick={toggleNav}
                                    >
                                        <Icon component={isNavOpen ? MdArrowDropUp : MdArrowDropDown} />
                                        <span className="btn-text" aria-hidden="true">Menu</span>
                                        <span className="sr-only">
                                            {isNavOpen ? 'Close menu' : 'Open menu'}
                                        </span>
                                    </button>
                                </div>

                                <div className="drawer-header-right">
                                    <Drawer.Button
                                        className="btn btn-link"
                                        open={isDrawerOpen}
                                        onClick={closeDrawer}
                                        aria-controls={drawerId}
                                    >
                                        <Icon component={MdClose} />
                                        <span className="sr-only">Hide side panel</span>
                                    </Drawer.Button>
                                </div>
                            </div>
                        </div>

                        <div className="drawer-body">
                            <section className={isNavOpen ? 'panel' : 'hidden'}>
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

                            {!isNavOpen ? (appMode === AppMode.EDIT) ? (
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
                            ) : null : null}
                        </div>
                    </section>
                </FocusDisabled>
            </Drawer>

            <ToastsContainer />
        </AppContext.Provider>
    );
}

export default withBrowserTest(App);
