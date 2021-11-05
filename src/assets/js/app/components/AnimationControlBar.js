import { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    MdPlayArrow,
    MdPause,
    MdStop,
    MdSkipNext,
    MdVolumeOff,
    MdVolumeUp
} from 'react-icons/md';

import Icon from '../components/Icon';
import AppContext from '../contexts/AppContext';

function AnimationControlBar({ muted, paused, setMuted, setPaused }) {
    const app = useContext(AppContext);

    if (app) {
        const animationModule = app.module('animationModule');

        return (
            <div className="form-section">
                <div className="form-group">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                if (paused) {
                                    animationModule.play();
                                } else {
                                    animationModule.pause();
                                }

                                setPaused(!paused);
                            }}
                        >
                            {paused ? (
                                <Fragment>
                                    <Icon component={MdPlayArrow} />
                                    <span className="sr-only">Play</span>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Icon component={MdPause} />
                                    <span className="sr-only">Pause</span>
                                </Fragment>
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                animationModule.pause();
                                animationModule.reset();

                                setPaused(true);
                            }}
                        >
                            <Icon component={MdStop} />
                            <span className="sr-only">Stop</span>
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={() => { animationModule.step(); }}
                        >
                            <Icon component={MdSkipNext} />
                            <span className="sr-only">Step forward</span>
                        </button>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                setMuted(!muted);

                                animationModule.muted = !muted;

                                app.refresh();
                            }}
                        >
                            {muted ? (
                                <Fragment>
                                    <Icon component={MdVolumeOff} />
                                    <span className="sr-only">Unmute</span>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Icon component={MdVolumeUp} />
                                    <span className="sr-only">Mute</span>
                                </Fragment>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

AnimationControlBar.propTypes = {
    muted: PropTypes.bool,
    paused: PropTypes.bool,
    setMuted: PropTypes.func,
    setPaused: PropTypes.func
};

AnimationControlBar.defaultProps = {
    setMuted: () => {},
    setPaused: () => {}
};

export default AnimationControlBar;
