import React, { useState, useContext } from 'react';

import AppContext from '../contexts/AppContext';

export default function AnimationControlBar() {
    const app = useContext(AppContext);
    const [paused, setPaused] = useState(false);

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
                            {paused ? 'Play' : 'Pause'}
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
                            Stop
                        </button>

                        <button
                            type="button"
                            className="btn"
                            onClick={() => { animationModule.step(); }}
                        >
                            Step forward
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
