import Module from '../core/Module';

/**
 * @class AnimationModule
 *
 * @classdesc Allow animation to be paused and continued.
 */
export default class AnimationModule extends Module {
    constructor() {
        super();

        this.app = null;
    }

    static displayName = 'animationModule';

    init(app) {
        this.app = app;
    }

    deinit() {
        if (this.play) {
            this.play();
        }
    }

    play() {
        const { clock } = this.app;

        if (!clock.running) {
            clock.start();
        }
    }

    pause() {
        this.app.clock.stop();
    }

    step() {
        const { clock, timestep } = this.app;

        if (!clock.running) {
            clock.elapsedTime += timestep;
            this.app.update(timestep);
        }
    }

    reset() {
        const { clock } = this.app;

        clock.startTime = 0;
        clock.oldTime = 0;
        clock.elapsedTime = 0;

        this.app.start();
    }
}
