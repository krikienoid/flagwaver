import FlagGroup from '../../subjects/FlagGroup';
import ControlModule from './ControlModule';

/**
 * @class FlagGroupModule
 *
 * @classdesc An interface for a flagpole and its flag.
 */
export default class FlagGroupModule extends ControlModule {
    constructor() {
        super();

        this.subject = null;
        this.app = null;
        this.configOptions = Object.assign({}, this.constructor.Subject.defaults);
    }

    static displayName = 'flagGroupModule';
    static Subject = FlagGroup;

    init(app) {
        this.app = app;
        this.subject = new this.constructor.Subject();

        this.app.scene.add(this.subject.object);
    }

    deinit() {
        if (this.subject) {
            this.app.scene.remove(this.subject.object);
            this.subject.destroy();
        }
    }

    setOptions(options) {
        if (this.subject) {
            this.app.scene.remove(this.subject.object);
            this.subject.destroy();
        }

        this.subject = new this.constructor.Subject(Object.assign(
            this.configOptions,
            options
        ));

        this.app.scene.add(this.subject.object);
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
