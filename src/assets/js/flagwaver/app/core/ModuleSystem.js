import Module from './Module';

/**
 * @class ModuleSystem
 *
 * @classdesc Manages a collection of modules.
 *
 * @param {App} [context]
 */
export default class ModuleSystem {
    constructor(context) {
        this.context = context || this;
        this.modules = [];
    }

    // Get modules by display name
    getModulesByType(displayName) {
        const modules = this.modules;
        const result = [];

        for (let i = 0, ii = modules.length; i < ii; i++) {
            const module = modules[i];

            if (module.constructor.displayName === displayName) {
                result.push(module);
            }
        }

        return result;
    }

    // Get module by display name and index
    module(displayName, index = 0) {
        const modules = this.modules;

        for (let i = 0, ii = modules.length, j = 0; i < ii; i++) {
            const module = modules[i];

            if (module.constructor.displayName === displayName) {
                if (j === index) {
                    return module;
                }

                j++;
            }
        }

        return null;
    }

    // Add module and call `module.init`
    add(module) {
        if (!(module instanceof Module)) { return; }

        if (module.init) {
            module.init(this.context);
        }

        this.modules.push(module);

        return module;
    }

    // Remove module and call `module.deinit`
    remove(module) {
        if (!(module instanceof Module)) { return; }

        const modules = this.modules;
        const index = modules.indexOf(module);

        if (index < 0) { return; }

        if (module.deinit) {
            module.deinit(this.context);
        }

        return modules.splice(index, 1)[0];
    }
}
