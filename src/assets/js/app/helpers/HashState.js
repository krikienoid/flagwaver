import ParamState from './ParamState';

const { history, location } = window;

// Check if browser supports the History API
const isHistorySupported = !!(history && history.replaceState);

// Check if browser allows history changes in current context
// https://bugs.chromium.org/p/chromium/issues/detail?id=529313
const isHistoryAllowed = (() => {
    try {
        history.replaceState(null, '', location.href);
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            console.log('Cannot push states to history object.');
            console.log(e.message);
        }

        return false;
    }

    return true;
})();

function setLocationHash(hash) {
    if (isHistorySupported && isHistoryAllowed) {
        const url = location.href.split('#')[0] + (hash ? '#' + hash : '');

        history.replaceState(null, '', url);
    } else {
        // The old fashioned way
        location.hash = hash;
    }
}

// Extract substring followed by '#', '#!', '#?' or '?'
const reUrlParamString = /^(?:[^#]*(?:#!|#\?|#)|[^\?]*\?)?(.*)$/;

function getParamString(url) {
    return url.replace(reUrlParamString, '$1');
}

function setParamString(string) {
    setLocationHash(string ? '?' + string : '');
}

export { isHistorySupported };

export default class HashState {
    constructor(fields) {
        const paramState = new ParamState(fields);

        this.getState = () =>
            paramState.parse(getParamString(location.href));

        this.setState = state =>
            setParamString(state ? paramState.stringify(state) : '');
    }
}
