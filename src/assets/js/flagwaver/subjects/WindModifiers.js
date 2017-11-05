/**
 * @module WindModifiers
 *
 * @description A collection of optional functions for customizing
 * wind behavior.
 */
var WindModifiers = {
    noEffect: function () {},

    blowFromLeftDirection: function (wind) {
        wind.force.set(2000, 0, 1000);
    },

    rotatingDirection: function (wind, time) {
        wind.force.set(
            Math.sin(time / 2000),
            Math.cos(time / 3000),
            Math.sin(time / 1000)
        );
    },

    constantSpeed: function (wind) {
        wind.force.multiplyScalar(wind.speed);
    },

    variableSpeed: function (wind, time) {
        wind.force.multiplyScalar(
            Math.cos(time / 7000) * (wind.speed / 2) + wind.speed
        );
    }
};

export default WindModifiers;
