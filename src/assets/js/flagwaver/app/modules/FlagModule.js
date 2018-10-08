import { Hoisting, Side, FlagpoleType } from '../../constants';
import { isNumeric, isObject, hasValue } from '../../utils/TypeUtils';
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
export default class FlagModule extends ControlModule {
    constructor(subject, context) {
        super();

        this.subject = subject || null;
        this.context = context || null;
        this.configOptions = Object.assign({}, this.constructor.Subject.defaults);
    }

    static displayName = 'flagModule';
    static Subject = FlagInterface;

    static validate = createPropertyValidator({
        topEdge: (value) => {
            if (hasValue(Side, value)) {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        hoisting: (value) => {
            if (hasValue(Hoisting, value)) {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        width: (value) => {
            const n = Number(value);

            if (isNumeric(value) && n > 0) {
                return n;
            } else if (value === 'auto') {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        height: (value) => {
            const n = Number(value);

            if (isNumeric(value) && n > 0) {
                return n;
            } else if (value === 'auto') {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        mass: (value) => {
            const n = Number(value);

            if (isNumeric(value) && n >= 0) {
                return n;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        granularity: (value) => {
            const n = Math.round(value);

            if (isNumeric(value) && n > 0) {
                return n;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        imgSrc: (value) => {
            if (typeof value === 'string') {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        },

        flagpoleType: (value) => {
            if (hasValue(FlagpoleType, value)) {
                return value;
            } else {
                console.error('FlagWaver.FlagModule.option: Invalid value.');
            }
        }
    });

    init(app) {
        this.subject = this.subject || new this.constructor.Subject();

        if (!this.context) {
            app.scene.add(this.subject.object);
        }
    }

    deinit(app) {
        if (!this.context) {
            app.scene.remove(this.subject.object);
            this.subject.destroy();
        }
    }

    reset() {
        this.subject.reset();
        this.subject.render();
    }

    update(deltaTime) {
        this.subject.simulate(deltaTime);
        this.subject.render();
    }

    setOptions(options, callback) {
        if (isObject(options)) {
            this.subject.setOptions(
                Object.assign(
                    this.configOptions,
                    this.constructor.validate(options)
                ),
                (flag) => {
                    if (callback) {
                        callback(this.configOptions);
                    }
                }
            );
        }
    }
}
