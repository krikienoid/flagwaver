export default function debounce(fn, wait = 250) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;

            fn.apply(null, args);
        }, wait);
    };
}
