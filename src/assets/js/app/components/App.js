import Modernizr from 'modernizr';
import { Fragment, useEffect, useRef, useState } from 'react';
import { MdClose, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

import { fromHash } from '../globals/HashStore';
import initApp from '../globals/initApp';
import AboutPanel from '../components/AboutPanel';
import AppCanvas from '../components/AppCanvas';
import AppModules from '../components/AppModules';
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
        key: AppMode.ABOUT,
        displayName: 'About'
    }
];

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [appMode, setAppMode] = useState(AppMode.EDIT);

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
        if (isDrawerOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
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

    const handleHashChange = () => {
        fromHash(store);
    };

    useEffect(() => {
        app.current = initApp();
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        forceUpdate();

        return () => {
            app.current.destroy();
            app.current = null;
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <AppContext.Provider value={app.current}>
            <AppModules />

            <div className="site-wrapper" aria-hidden={isDrawerOpen}>
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
                        ) : null}
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
