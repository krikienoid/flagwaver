import Module from './Module';

/**
 * @class ModuleSystem
 *
 * @classdesc Manages a collection of modules.
 *
 * @param {App} [context]
 */
function ModuleSystem(context) {
    this.context = context || this;
    this.modules = [];
}

Object.assign(ModuleSystem.prototype, {
    // Get module by display name and index
    module: function (displayName, index) {
        var modules = this.modules;
        var i, ii, j, module;

        index = index || 0;

        for (i = 0, ii = modules.length, j = 0; i < ii; i++) {
            module = modules[i];

            if (module.displayName === displayName) {
                if (j === index) {
                    return module;
                }

                j++;
            }
        }

        return null;
    },

    // Add module and call `module.init`
    add: function (module) {
        if (!(module instanceof Module)) { return; }

        if (module.init) {
            module.init(this.context);
        }

        this.modules.push(module);

        return module;
    },

    // Remove module and call `module.deinit`
    remove: function (module) {
        var modules, index;

        if (!(module instanceof Module)) { return; }

        modules = this.modules;
        index = modules.indexOf(module);

        if (index < 0) { return; }

        if (module.deinit) {
            module.deinit(this.context);
        }

        return modules.splice(index, 1)[0];
    }
});

export default ModuleSystem;
