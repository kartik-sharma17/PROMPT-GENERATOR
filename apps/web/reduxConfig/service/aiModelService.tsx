import { RootApiService } from ".."

export type AiModel = {
  id: string
  name: string
  description: string
  promptDescription: string
}

export const aiModelService = RootApiService.injectEndpoints({
  endpoints: (build) => ({
    getAiModels: build.query<{ data: AiModel[] }, void>({
      query: () => ({
        url: '/model',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAiModelsQuery } = aiModelService