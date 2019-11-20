import FlagGroup from '../../subjects/FlagGroup';
import Module from '../core/Module';

/**
 * @class FlagGroupModule
 *
 * @classdesc An interface for a flagpole and its flag.
 *
 * @param {Object} [options]
 */
export default class FlagGroupModule extends Module {
    constructor(options) {
        super();

        this.subject = new FlagGroup(
            Object.assign({}, FlagGroup.defaults, options)
        );

        this.app = null;
    }

    static displayName = 'flagGroupModule';

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
