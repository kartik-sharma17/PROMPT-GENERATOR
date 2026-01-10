import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const RootApiService = createApi({
    reducerPath: 'rootApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
    tagTypes: ["Chat"],
    endpoints: (build) => ({}),
})