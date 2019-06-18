import { createStore, applyMiddleware } from 'redux';

import hashStoreMiddleware from '../middleware/hashStoreMiddleware';
import toastsMiddleware from '../middleware/toastsMiddleware';

import rootReducer from './modules/root';

const store = createStore(
    rootReducer,
    applyMiddleware(
        hashStoreMiddleware,
        toastsMiddleware
    )
);

export default store;
