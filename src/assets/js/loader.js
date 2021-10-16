// Loading Polyfills Only When Needed
// https://philipwalton.com/articles/loading-polyfills-only-when-needed/

function main(e) {
    if (e) {
        console.error(e.message);
    }

    // This magic string is replaced at compile time with an IIFE of the app
    // JS. It is necessary to wrap the IIFE in this function to prevent it from
    // attempting to use ES6 features before the polyfill loader performs
    // its checks.

    _MAIN_JS_
}

function browserSupportsAllFeatures() {
    return (
        [].find
        && [].findIndex
        && window.Map
        && Object.assign
        && Object.values
        && window.Promise
        && window.Set
        && window.Symbol
        && window.URL
    );
}

function loadScript(src, done) {
    const script = document.createElement('script');

    script.onload = function () {
        done();
    };

    script.onerror = function () {
        done(new Error('Failed to load script "' + src + '".'));
    };

    script.src = src;

    document.head.appendChild(script);
}

function loader() {
    if (browserSupportsAllFeatures()) {
        // Browsers that support all features run `main()` immediately.
        main();
    } else {
        // All other browsers load polyfills and then run `main()`.
        loadScript(
            './assets/js/polyfills.js',
            main
        );
    }
}

loader();
