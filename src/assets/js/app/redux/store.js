import { createStore } from 'redux';

import rootReducer from './modules/root';

const store = createStore(rootReducer);

export default store;
