"use client"

import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { Toaster } from 'sonner'
import { PersistGate } from 'redux-persist/integration/react'
import AuthWatcher from '@/app/authWatcher'

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}><PersistGate persistor={persistor}><AuthWatcher>{children}</AuthWatcher><Toaster position='top-right' /></PersistGate></Provider>
}