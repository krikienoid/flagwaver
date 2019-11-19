import Wind from '../../subjects/Wind';
import ControlModule from './ControlModule';

/**
 * @class WindModule
 *
 * @classdesc Adds wind to scene.
 *
 * @param {Object} [options]
 */
export default class WindModule extends ControlModule {
    constructor(options) {
        super();

        this.subject = new this.constructor.Subject(Object.assign(
            {},
            this.constructor.Subject.defaults,
            options
        ));
    }

    static displayName = 'windModule';
    static Subject = Wind;

    update(deltaTime) {
        this.subject.update(deltaTime);
    }
}
