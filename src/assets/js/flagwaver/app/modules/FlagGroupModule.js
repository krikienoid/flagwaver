import FlagGroup from '../../subjects/FlagGroup';
import ControlModule from './ControlModule';

/**
 * @class FlagGroupModule
 *
 * @classdesc An interface for a flagpole and its flag.
 *
 * @param {Object} [options]
 */
export default class FlagGroupModule extends ControlModule {
    constructor(options) {
        super();

        this.subject = new this.constructor.Subject(Object.assign(
            {},
            this.constructor.Subject.defaults,
            options
        ));

        this.app = null;
    }

    static displayName = 'flagGroupModule';
    static Subject = FlagGroup;

    init(app) {
        this.app = app;
        this.app.scene.add(this.subject.object);
    }

    deinit() {
        this.app.scene.remove(this.subject.object);
        this.subject.destroy();
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
