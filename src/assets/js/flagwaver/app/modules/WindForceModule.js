import applyWindForceToCloth from '../../interactions/applyWindForceToCloth';
import InteractionModule from './InteractionModule';

/**
 * @class WindForceModule
 *
 * @classdesc Applies wind to subjects.
 */
export default class WindForceModule extends InteractionModule {
    static displayName = 'windForceModule';

    interact(subject, wind) {
        applyWindForceToCloth(subject.flag.cloth, wind, subject.flag.object);
    }
}
