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
export default class FlagGroupModule extends ControlModule {
    constructor(subject, context) {
        super();

        this.subject = subject || null;
        this.context = context || null;
        this.flag = null;
    }

    static displayName = 'flagGroupModule';
    static Subject = FlagGroupInterface;

    init(app) {
        this.subject = new this.constructor.Subject();

        if (!this.context) {
            app.scene.add(this.subject.object);
        }

        this.flag = new FlagModule(this.subject.flagInterface, this.subject.object);

        app.add(this.flag);
    }

    deinit(app) {
        app.remove(this.flag);

        if (!this.context) {
            app.scene.remove(this.subject.object);
            this.subject.destroy();
        }
    }

    reset() {
        this.subject.reset();
        this.subject.render();
    }

    update(deltaTime) {
        this.subject.simulate(deltaTime);
        this.subject.render();
    }
}
