import Module from '../core/Module';

/**
 * @class InteractionModule
 * @interface
 *
 * @classdesc A module that mediates physical interactions.
 *
 * @param {string[]} [subjectTypes] - Modules of subjects that are acted upon.
 * @param {string[]} [actionTypes] - Modules that cause an action on subjects.
 */
export default class InteractionModule extends Module {
    constructor(subjectTypes, actionTypes) {
        super();

        this.app = null;
        this.subjectTypes = subjectTypes || [];
        this.actionTypes = actionTypes || [];
        this.subjects = [];
        this.actions = [];
        this.needsUpdate = false;
    }

    static displayName = 'interactionModule';

    updateModulesList() {
        const app = this.app;

        if (!app) { return; }

        const { modules } = app;

        const subjectTypes = this.subjectTypes;
        const actionTypes = this.actionTypes;
        const subjects = [];
        const actions = [];

        for (let i = 0, ii = modules.length; i < ii; i++) {
            const module = modules[i];

            if (subjectTypes.indexOf(module.constructor.displayName) >= 0) {
                subjects.push(module.subject);
            }

            if (actionTypes.indexOf(module.constructor.displayName) >= 0) {
                actions.push(module.subject);
            }
        }

        this.subjects = subjects;
        this.actions = actions;
    }

    init(app) {
        this.app = app;

        this.updateModulesList();
    }

    interact(subject, action) {
    }

    update(deltaTime) {
        const interact = this.interact;

        if (this.needsUpdate) {
            this.updateModulesList();
            this.needsUpdate = false;
        }

        const subjects = this.subjects;
        const actions = this.actions;

        if (actions.length) {
            for (let i = 0, ii = actions.length; i < ii; i++) {
                for (let j = 0, jl = subjects.length; j < jl; j++) {
                    interact(subjects[j], actions[i]);
                }
            }
        } else {
            for (let j = 0, jl = subjects.length; j < jl; j++) {
                interact(subjects[j]);
            }
        }
    }
}
