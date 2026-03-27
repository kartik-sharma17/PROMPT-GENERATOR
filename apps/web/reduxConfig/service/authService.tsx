import { RootApiService } from "../index"

export const AuthApiSlice = RootApiService.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: "auth/register",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Auth"]
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "auth/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Auth"]
        }),
        verifyAccount: builder.query({
            query: (token) => `auth/verify-email/${token}`,
            providesTags: ["Login"]
        })
    })
})

export const { useSignupMutation, useVerifyAccountQuery, useLoginMutation } = AuthApiSlice