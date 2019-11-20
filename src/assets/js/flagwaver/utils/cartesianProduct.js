export default function cartesianProduct(arrays) {
    const last = arrays.length - 1;
    const result = [];

    function next(i, head) {
        const array = arrays[i];

        for (let j = 0, jj = array.length; j < jj; j++) {
            const part = head.concat([array[j]]);

            if (i === last) {
                result.push(part);
            } else {
                next(i + 1, part);
            }
        }
    }

    next(0, []);

    return result;
}
