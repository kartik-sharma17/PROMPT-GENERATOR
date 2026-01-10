import { RootApiService } from "../index"

export const AuthApiSlice = RootApiService.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Auth"]
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Auth"]
        }),
        verifyAccount: builder.query({
            query: (token) => `/verify-email/${token}`,
            providesTags: ["Login"]
        })
    })
})

export const { useSignupMutation, useVerifyAccountQuery, useLoginMutation } = AuthApiSlice