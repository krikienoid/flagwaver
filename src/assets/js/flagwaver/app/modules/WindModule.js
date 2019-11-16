import Wind from '../../subjects/Wind';
import ControlModule from './ControlModule';

/**
 * @class WindModule
 *
 * @classdesc Adds wind to scene.
 *
 * @param {Wind} wind
 */
export default class WindModule extends ControlModule {
    constructor() {
        super();

        this.subject = new this.constructor.Subject();
        this.configOptions = Object.assign({}, this.constructor.Subject.defaults);
    }

    static displayName = 'windModule';
    static Subject = Wind;

    update(deltaTime) {
        this.subject.update(deltaTime);
    }

    setOptions(options) {
        this.subject = new this.constructor.Subject(Object.assign(
            this.configOptions,
            options
        ));
    }
}
