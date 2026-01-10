import { RootApiService } from "../index"

export const ChatApiSlice = RootApiService.injectEndpoints({
    endpoints: (builder) => ({
        chat: builder.mutation({
            query: (data) => ({
                url: `/batch`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Chat"]
        })
    })
})

export const { useChatMutation } = ChatApiSlice;