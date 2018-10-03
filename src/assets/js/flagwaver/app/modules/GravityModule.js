import applyGravityToCloth from '../../interactions/applyGravityToCloth';
import InteractionModule from './InteractionModule';

/**
 * @class GravityModule
 *
 * @classdesc Applies gravity to subjects.
 */
export default class GravityModule extends InteractionModule {
    static displayName = 'gravityModule';

    interact(subject) {
        applyGravityToCloth(subject.flag.cloth, subject.flag.object);
    }
}
