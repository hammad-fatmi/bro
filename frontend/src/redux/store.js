import userSlice from "./userSlice"

import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";   // ✅ ADD THIS

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

import storage from 'redux-persist/lib/storage'

const persistStorage = storage.default || storage;

const persistConfig = {
    key: 'Ekart',
    version: 1,
    storage: persistStorage,
}

const rootReducer = combineReducers({
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export default store