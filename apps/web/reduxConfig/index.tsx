import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store'

export const RootApiService = createApi({
    reducerPath: 'rootApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState
            const token = state?.auth.token || null

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers
        }
    }),
    tagTypes: ["Chat", "Auth", "Login", "History"],
    endpoints: (build) => ({}),
})