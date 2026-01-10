import { configureStore } from '@reduxjs/toolkit'
import { rootApi } from '.'

export const store = configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false,}).concat(rootApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch