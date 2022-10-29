const dict = {};

export const getObject = url => dict[url];

export const createObjectURL = (blob) => {
    const url = URL.createObjectURL(blob);

    dict[url] = blob;

    return url;
};

export const revokeObjectURL = (url) => {
    if (dict[url]) {
        URL.revokeObjectURL(url);

        delete dict[url];
    }
};
