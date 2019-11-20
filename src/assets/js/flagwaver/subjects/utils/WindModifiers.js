/**
 * @module WindModifiers
 *
 * @description A collection of optional functions for customizing
 * wind behavior.
 */
const WindModifiers = {
    noEffect: x => x,

    blowFromLeftDirection: (direction, time) => direction.set(2000, 0, 1000),

    rotatingDirection: (direction, time) =>
        direction.set(
            Math.sin(time / 2000),
            Math.cos(time / 3000),
            Math.sin(time / 1000)
        ),

    constantSpeed: (speed, time) => speed,

    variableSpeed: (speed, time) => Math.cos(time / 7000) * (speed / 2) + speed
};

export default WindModifiers;
