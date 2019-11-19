import Wind from '../../subjects/Wind';
import Module from '../core/Module';

/**
 * @class WindModule
 *
 * @classdesc Adds wind to scene.
 *
 * @param {Object} [options]
 */
export default class WindModule extends Module {
    constructor(options) {
        super();

        this.subject = new Wind(
            Object.assign({}, Wind.defaults, options)
        );
    }

    static displayName = 'windModule';

    update(deltaTime) {
        this.subject.update(deltaTime);
    }
}
