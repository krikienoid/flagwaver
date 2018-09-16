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
function InteractionModule(subjectTypes, actionTypes) {
    this.app = null;
    this.subjectTypes = subjectTypes || [];
    this.actionTypes = actionTypes || [];
    this.subjects = [];
    this.actions = [];
    this.needsUpdate = false;
}

InteractionModule.prototype = Object.create(Module.prototype);
InteractionModule.prototype.constructor = InteractionModule;

Object.assign(InteractionModule.prototype, {
    displayName: 'interactionModule',

    updateModulesList: function () {
        var app = this.app;

        if (!app) { return; }

        var modules = app.modules;

        var subjectTypes = this.subjectTypes;
        var actionTypes = this.actionTypes;
        var subjects = [];
        var actions = [];

        var i, il;
        var module;

        for (i = 0, il = modules.length; i < il; i++) {
            module = modules[i];

            if (subjectTypes.indexOf(module.displayName) >= 0) {
                subjects.push(module.subject);
            }

            if (actionTypes.indexOf(module.displayName) >= 0) {
                actions.push(module.subject);
            }
        }

        this.subjects = subjects;
        this.actions = actions;
    },

    init: function (app) {
        this.app = app;

        this.updateModulesList();
    },

    interact: function (subject, action) {
    },

    update: function (deltaTime) {
        var interact = this.interact;

        var subjects;
        var actions;

        var i, il, j, jl;
        var action;

        if (this.needsUpdate) {
            this.updateModulesList();
            this.needsUpdate = false;
        }

        subjects = this.subjects;
        actions = this.actions;

        if (actions.length) {
            for (i = 0, il = actions.length; i < il; i++) {
                action = actions[i];

                for (j = 0, jl = subjects.length; j < jl; j++) {
                    interact(subjects[j], action);
                }
            }
        } else {
            for (j = 0, jl = subjects.length; j < jl; j++) {
                interact(subjects[j]);
            }
        }
    }
});

export default InteractionModule;
