import Module from '../core/Module';

/**
 * @class ControlModule
 * @interface
 *
 * @classdesc A ControlModule is a wrapper that provides an interface
 * between the main app and a scene object.
 */
export default class ControlModule extends Module {
    static displayName = 'controlModule';
    static Subject = Object;
}
