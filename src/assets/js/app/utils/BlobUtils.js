const dict = {};

export const getObject = url => dict[url];

export const createObjectURL = (blob) => {
    const url = URL.createObjectURL(blob);

    dict[url] = blob;

    return url;
};

export const revokeObjectURL = (url) => {
    URL.revokeObjectURL(url);

    if (dict[url]) {
        delete dict[url];
    }
};
