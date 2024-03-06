'use client';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import uiReducer from './slices/ui';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: any, value = '') {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

// const establishmentPersistConfig = {
//   key: 'establecimientos',
//   storage,
//   keyPrefix: 'redux-',
//   whitelist: ['establishmentSelected', 'establishment'],
// };

// const vehiclePersistConfig = {
//   key: 'vehicles',
//   storage,
//   keyPrefix: 'redux-',
//   whitelist: ['filters', 'valueLabelFilterSelect'],
// };

const rootReducer = combineReducers({
  ui: uiReducer,
});

export { rootPersistConfig, rootReducer };
