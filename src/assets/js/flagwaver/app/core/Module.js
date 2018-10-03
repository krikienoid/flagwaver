/**
 * @class Module
 * @interface
 *
 * @classdesc A Module encapsulates a piece of functionality that can
 * be applied to a scene. This class is just a skeleton for other classes
 * to inherit from.
 *
 * Each module should have an `init` method and a `deinit` method which
 * should be called whenever it is added to or removed from a scene.
 */
export default class Module {
    static displayName = 'module';

    init() {}

    deinit() {}
}
