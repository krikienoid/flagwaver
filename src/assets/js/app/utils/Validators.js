export const isURL = (value) => {
    try {
        return !!(new URL(value));
    } catch (e) {
        return false;
    }
};
