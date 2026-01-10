"use client"

import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'sonner'

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children} <Toaster position='top-right' /></Provider>
}