import { configureStore } from '@reduxjs/toolkit'
import { RootApiService } from '.'
import authReducer from './slice/authSlice'

export const store = configureStore({
    reducer: {
        "auth": authReducer,
        [RootApiService.reducerPath]: RootApiService.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, }).concat(RootApiService.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch