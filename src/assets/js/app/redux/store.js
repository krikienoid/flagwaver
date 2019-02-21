import { createStore, applyMiddleware } from 'redux';

import hashStoreMiddleware from '../middleware/hashStoreMiddleware';

import rootReducer from './modules/root';

const store = createStore(
    rootReducer,
    applyMiddleware(hashStoreMiddleware)
);

export default store;
