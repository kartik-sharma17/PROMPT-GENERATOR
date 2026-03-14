import { RootApiService } from "../index"

export const ProjectApiSlice = RootApiService.injectEndpoints({
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (data) => ({
                url: `/project/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Project"]
        }),

        getProject: builder.query({
            query: () => ({
                url: `/project/list`,
                method: "GET",
            }),
            providesTags: ["Project"]
        }),

        deleteProject: builder.mutation({
            query: (projectId: string) => ({
                url: `/project/delete?projectId=${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"]
        }),

        updateProject: builder.mutation({
            query: (data) => ({
                url: `/project/update`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Project"]
        }),
    })
})

export const {
    useCreateProjectMutation,
    useGetProjectQuery,
    useDeleteProjectMutation,
    useUpdateProjectMutation,
} = ProjectApiSlice;