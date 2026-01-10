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
        })
    })
})

export const {useSignupMutation} = AuthApiSlice