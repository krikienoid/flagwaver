import FlagGroupInterface from '../../interface/FlagGroupInterface';
import ControlModule from './ControlModule';
import FlagModule from './FlagModule';

/**
 * @class FlagGroupModule
 *
 * @classdesc An interface for a flagpole and its flag.
 *
 * @param {Object} [subject]
 * @param {THREE.Object3D} [context]
 */
function FlagGroupModule(subject, context) {
    this.subject = subject || null;
    this.context = context || null;
    this.flag = null;
}

FlagGroupModule.prototype = Object.create(ControlModule.prototype);
FlagGroupModule.prototype.constructor = FlagGroupModule;

Object.assign(FlagGroupModule.prototype, {
    displayName: 'flagGroupModule',
    Subject: FlagGroupInterface,

    init: function (app) {
        this.subject = new this.Subject();

        if (!this.context) {
            app.scene.add(this.subject.object);
        }

        this.flag = new FlagModule(this.subject.flagInterface, this.subject.object);

        app.add(this.flag);
    },

    deinit: function (app) {
        app.remove(this.flag);

        if (!this.context) {
            app.scene.remove(this.subject.object);
            this.subject.destroy();
        }
    },

    reset: function () {
        this.subject.reset();
        this.subject.render();
    },

    update: function (deltaTime) {
        this.subject.simulate(deltaTime);
        this.subject.render();
    }
});

export default FlagGroupModule;
