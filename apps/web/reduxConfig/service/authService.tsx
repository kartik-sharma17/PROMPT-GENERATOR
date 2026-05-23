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
        }),
        // Task 3: Resend verification link
        resendVerification: builder.mutation({
            query: (email: string) => ({
                url: `auth/resend-verification?email=${encodeURIComponent(email)}`,
                method: "POST",
            }),
            invalidatesTags: ["Auth"]
        }),
        // Task 4: Forget password — send reset link to email
        forgotPasswordSendLink: builder.mutation({
            query: (email: string) => ({
                url: `auth/reset-password-request?email=${encodeURIComponent(email)}`,
                method: "GET",
            }),
        }),
        // Task 4: Reset password — submit new password with token
        resetPassword: builder.mutation({
            query: (data: { newPassword: string; token: string }) => ({
                url: "auth/reset-password",
                method: "POST",
                body: data,
            }),
        }),
        contactUs: builder.mutation({
            query: (data: {
                full_name: string;
                email: string;
                have_account: boolean;
                description: string;
            }) => ({
                url: "contactus",
                method: "POST",
                body: data,
            }),
        }),
    })
})

export const {
    useSignupMutation,
    useVerifyAccountQuery,
    useLoginMutation,
    useResendVerificationMutation,
    useForgotPasswordSendLinkMutation,
    useResetPasswordMutation,
    useContactUsMutation,
} = AuthApiSlice