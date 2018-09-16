import Utils from '../../utils/Utils';
import createPropertyValidator from '../../helpers/createPropertyValidator';
import Wind from '../../subjects/Wind';
import WindModifiers from '../../subjects/WindModifiers';
import ControlModule from './ControlModule';

function getModifierFnFromOption(value, defaultValue) {
    if (Utils.isFunction(value)) {
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
function WindModule() {
    this.subject = new this.Subject();
    this.configOptions = Object.assign({}, this.Subject.defaults);
}

WindModule.prototype = Object.create(ControlModule.prototype);
WindModule.prototype.constructor = WindModule;

Object.assign(WindModule, {
    validate: createPropertyValidator({
        speed: function (value) {
            var n = Number(value);

            if (Utils.isNumeric(value) && n >= 0) {
                return n;
            } else {
                console.error('FlagWaver.WindModule.option: Invalid value.');
            }
        }
    })
});

Object.assign(WindModule.prototype, {
    displayName: 'windModule',
    Subject: Wind,

    update: function (deltaTime) {
        this.subject.update(deltaTime);
    },

    setOptions: function (options) {
        this.subject = new this.Subject(Object.assign(
            this.configOptions,
            WindModule.validate(options)
        ));
    }
});

export default WindModule;
