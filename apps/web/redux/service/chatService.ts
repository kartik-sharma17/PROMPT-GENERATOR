import { rootApi } from "@reduxjs/toolkit";

export const ChatApiSlice = rootApi.injectEndpoints({
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

export const {useChatMutation} = ChatApiSlice;