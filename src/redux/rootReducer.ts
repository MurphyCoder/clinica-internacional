"use client";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// slices
import authReducer from "./slices/auth";

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: any, value = "") {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: [],
};

const authPersistConfig = {
  key: "auth",
  storage,
  keyPrefix: "redux-",
  whitelist: ["user"],
};

// const  rootReducer = combineReducers({
//   auth: persistReducer(authPersistConfig, authReducer),
//   authReducer,
// });
// convertir para ts
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});
export type RootState = ReturnType<typeof rootReducer>;
export { rootReducer, rootPersistConfig };
