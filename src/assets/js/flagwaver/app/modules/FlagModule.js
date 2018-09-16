import { Hoisting, Side, FlagpoleType } from '../../constants';
import Utils from '../../utils/Utils';
import createPropertyValidator from '../../helpers/createPropertyValidator';
import FlagInterface from '../../interface/FlagInterface';
import ControlModule from './ControlModule';

/**
 * @class FlagModule
 *
 * @classdesc An interface for a single flag.
 *
 * @param {Object} [subject]
 * @param {THREE.Object3D} [context]
 */
function FlagModule(subject, context) {
    this.subject = subject || null;
    this.context = context || null;
    this.configOptions = Object.assign({}, this.Subject.defaults);
}

FlagModule.prototype = Object.create(ControlModule.prototype);
FlagModule.prototype.constructor = FlagModule;

Object.assign(FlagModule, {
    validate: createPropertyValidator({
        topEdge: function (value) {
            if (Utils.hasValue(Side, value)) {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        hoisting: function (value) {
            if (Utils.hasValue(Hoisting, value)) {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        width: function (value) {
            var n = Number(value);

            if (Utils.isNumeric(value) && n > 0) {
                return n;
            } else if (value === 'auto') {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        height: function (value) {
            var n = Number(value);

            if (Utils.isNumeric(value) && n > 0) {
                return n;
            } else if (value === 'auto') {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        mass: function (value) {
            var n = Number(value);

            if (Utils.isNumeric(value) && n >= 0) {
                return n;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        granularity: function (value) {
            var n = Math.round(value);

            if (Utils.isNumeric(value) && n > 0) {
                return n;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        imgSrc: function (value) {
            if (typeof value === 'string') {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        flagpoleType: function (value) {
            if (Utils.hasValue(FlagpoleType, value)) {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        }
    })
});

Object.assign(FlagModule.prototype, {
    displayName: 'flagModule',
    Subject: FlagInterface,

    init: function (app) {
        this.subject = this.subject || new this.Subject();

        if (!this.context) {
            app.scene.add(this.subject.object);
        }
    },

    deinit: function (app) {
        if (!this.context) {
            app.scene.remove(this.subject.object);
            this.subject.destroy();
        }
    },

    reset: function () {
        this.subject.reset();
        this.subject.render();
    },

    update: function (deltaTime) {
        this.subject.simulate(deltaTime);
        this.subject.render();
    },

    setOptions: function (options, callback) {
        var self = this;

        if (Utils.isObject(options)) {
            this.subject.setOptions(
                Object.assign(
                    this.configOptions,
                    FlagModule.validate(options)
                ),
                function (flag) {
                    if (callback) {
                        callback(self.configOptions);
                    }
                }
            );
        }
    }
});

export default FlagModule;
