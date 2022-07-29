const reColorHex = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

export const isColorHex = value => reColorHex.test(value);

export const isURL = (value) => {
    try {
        return !!(new URL(value));
    } catch (e) {
        return false;
    }
};
