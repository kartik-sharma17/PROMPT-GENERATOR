import { RootApiService } from ".."

export const historyService = RootApiService.injectEndpoints({
    endpoints: (build) => ({

        // GET /chat/history
        getHistory: build.query({
            query: () => ({
                url: '/chat/history',
                method: 'GET',
            }),
            providesTags: ['History'],
        }),

        // GET /chat/message?historyId=...
        getMessages: build.mutation({
            query: ({ historyId }: { historyId: string }) => ({
                url: `/chat/message?historyId=${historyId}`,
                method: 'GET',
            }),
        }),

        // DELETE /chat/delete?historyId=...
        deleteHistory: build.mutation({
            query: (historyId: string) => ({
                url: `/chat/delete?historyId=${historyId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['History'],
        }),

    }),
    overrideExisting: false,
})

export const {
    useGetHistoryQuery,
    useGetMessagesMutation,
    useDeleteHistoryMutation,
} = historyService