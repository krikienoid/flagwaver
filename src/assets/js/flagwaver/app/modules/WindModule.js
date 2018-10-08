import { isNumeric, isFunction } from '../../utils/TypeUtils';
import createPropertyValidator from '../../helpers/createPropertyValidator';
import Wind from '../../subjects/Wind';
import WindModifiers from '../../subjects/WindModifiers';
import ControlModule from './ControlModule';

function getModifierFnFromOption(value, defaultValue) {
    if (isFunction(value)) {
        return value;
    } else if (WindModifiers[value]) {
        return WindModifiers[value];
    } else {
        console.error('FlagWaver.WindModule.option: Invalid value.');
        return null;
    }
}

/**
 * @class WindModule
 *
 * @classdesc Adds wind to scene.
 *
 * @param {Wind} wind
 */
export default class WindModule extends ControlModule {
    constructor() {
        super();

        this.subject = new this.constructor.Subject();
        this.configOptions = Object.assign({}, this.constructor.Subject.defaults);
    }

    static displayName = 'windModule';
    static Subject = Wind;

    static validate = createPropertyValidator({
        speed: (value) => {
            const n = Number(value);

            if (isNumeric(value) && n >= 0) {
                return n;
            } else {
                console.error('FlagWaver.WindModule.option: Invalid value.');
            }
        }
    });

    update(deltaTime) {
        this.subject.update(deltaTime);
    }

    setOptions(options) {
        this.subject = new this.constructor.Subject(Object.assign(
            this.configOptions,
            this.constructor.validate(options)
        ));
    }
}
