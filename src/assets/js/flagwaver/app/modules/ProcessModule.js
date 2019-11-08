import Module from '../core/Module';

/**
 * @class ProcessModule
 *
 * @classdesc A module for running a function on each frame.
 *
 * @param {Function} updateFn
 * @param {Function} [onNeedsUpdate]
 */
export default class ProcessModule extends Module {
    constructor(updateFn, onNeedsUpdate) {
        super();

        this.updateFn = updateFn;
        this.onNeedsUpdate = onNeedsUpdate || (() => {});
        this.needsUpdate = false;
    }

    static displayName = 'processModule';

    update(deltaTime) {
        if (this.needsUpdate) {
            this.onNeedsUpdate();
            this.needsUpdate = false;
        }

        this.updateFn(deltaTime);
    }
}
