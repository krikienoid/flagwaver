import Module from '../core/Module';

/**
 * @class ControlModule
 * @interface
 *
 * @classdesc A ControlModule is a wrapper that provides an interface
 * between the main app and a scene object.
 */
function ControlModule() {
}

ControlModule.prototype = Object.create(Module.prototype);
ControlModule.prototype.constructor = ControlModule;

Object.assign(ControlModule.prototype, {
    displayName: 'controlModule',
    Subject: Object
});

export default ControlModule;
