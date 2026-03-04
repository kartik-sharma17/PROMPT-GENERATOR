import { configureStore } from '@reduxjs/toolkit'
import { RootApiService } from '.'
import authReducer from './slice/authSlice'
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

// 🔹 Persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"]
};

const reducer = combineReducers(
    {
        "auth": authReducer,
        [RootApiService.reducerPath]: RootApiService.reducer
    }
)

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }).concat(RootApiService.middleware)
})

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch