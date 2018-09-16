import Module from '../core/Module';

/**
 * @class AnimationModule
 *
 * @classdesc Allow animation to be paused and continued.
 */
function AnimationModule() {
    this.app = null;
}

AnimationModule.prototype = Object.create(Module.prototype);
AnimationModule.prototype.constructor = AnimationModule;

Object.assign(AnimationModule.prototype, {
    displayName: 'animationModule',

    init: function (app) {
        this.app = app;
    },

    deinit: function () {
        if (this.play) {
            this.play();
        }
    },

    play: function () {
        var clock = this.app.clock;

        if (!clock.running) {
            clock.start();
        }
    },

    pause: function () {
        this.app.clock.stop();
    },

    step: function () {
        var clock = this.app.clock;
        var timestep = this.app.timestep;

        if (!clock.running) {
            clock.elapsedTime += timestep;
            this.app.update(timestep);
        }
    },

    reset: function () {
        var clock = this.app.clock;

        clock.startTime = 0;
        clock.oldTime = 0;
        clock.elapsedTime = 0;

        this.app.start();
    }
});

export default AnimationModule;
