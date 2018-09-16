import applyGravityToCloth from '../../interactions/applyGravityToCloth';
import InteractionModule from './InteractionModule';

/**
 * @class GravityModule
 *
 * @classdesc Applies gravity to subjects.
 */
function GravityModule() {
    InteractionModule.apply(this, arguments);
}

GravityModule.prototype = Object.create(InteractionModule.prototype);
GravityModule.prototype.constructor = GravityModule;

Object.assign(GravityModule.prototype, {
    displayName: 'gravityModule',

    interact: function (subject) {
        applyGravityToCloth(subject.flag.cloth, subject.flag.object);
    }
});

export default GravityModule;
