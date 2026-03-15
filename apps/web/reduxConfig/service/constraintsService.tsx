import { RootApiService } from "../index"

export type Constraint = {
  id: string
  name: string
  description: string
  promptDescription: string
}

export const ConstraintsApiSlice = RootApiService.injectEndpoints({
  endpoints: (builder) => ({
    getConstraints: builder.query<{ data: Constraint[] }, void>({
      query: () => ({
        url: `/constraint`,
        method: "GET",
      }),
      providesTags: ["Constraints"],
    }),
  }),
})

export const { useGetConstraintsQuery } = ConstraintsApiSlice