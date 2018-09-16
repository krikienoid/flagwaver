import applyWindForceToCloth from '../../interactions/applyWindForceToCloth';
import InteractionModule from './InteractionModule';

/**
 * @class WindForceModule
 *
 * @classdesc Applies wind to subjects.
 */
function WindForceModule() {
    InteractionModule.apply(this, arguments);
}

WindForceModule.prototype = Object.create(InteractionModule.prototype);
WindForceModule.prototype.constructor = WindForceModule;

Object.assign(WindForceModule.prototype, {
    displayName: 'windForceModule',

    interact: function (subject, wind) {
        applyWindForceToCloth(subject.flag.cloth, wind, subject.flag.object);
    }
});

export default WindForceModule;
