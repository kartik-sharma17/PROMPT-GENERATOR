import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const RootApiService = createApi({
    reducerPath: 'rootApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
    tagTypes: ["Chat", "Auth"],
    endpoints: (build) => ({}),
})