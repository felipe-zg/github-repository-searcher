import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppServices } from '@/state/services'
import type { SearchRepositoryParams } from '@/domain/use-cases/SearchRepository'
import type { RepositoryModel, RepositorySearchResult } from '@/domain/models'

interface GitHubRepositoryState {
  repositories: RepositoryModel[]
  loading: boolean
  error: string | null
  currentPage: number
  perPage: number
  totalCount: number
  currentRequestId: string | null
}

export const fetchRepositories = createAsyncThunk<
  RepositorySearchResult,
  SearchRepositoryParams,
  {
    extra: AppServices
    rejectValue: string
  }
>(
  'githubRepository/fetchRepositories',
  async (params, { extra, rejectWithValue, signal }) => {
    try {
      return await extra.searchRepository.search(params, signal)
    } catch (error) {
      if (signal.aborted) {
        throw error
      }

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : '予期しないエラーが発生しました。しばらくしてからもう一度お試しください。'
      )
    }
  }
)

const initialState: GitHubRepositoryState = {
  repositories: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  currentRequestId: null
}

const githubRepositorySlice = createSlice({
  name: 'githubRepository',
  initialState,

  reducers: {
    clearRepositories(state) {
      state.repositories = []
      state.loading = false
      state.error = null
      state.currentPage = 1
      state.totalCount = 0
      state.currentRequestId = null
    },

    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositories.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.currentRequestId = action.meta.requestId
      })

      .addCase(fetchRepositories.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return

        state.loading = false
        state.repositories = action.payload.repositories
        state.totalCount = action.payload.totalCount
        state.currentPage = action.meta.arg.page
        state.currentRequestId = null
      })

      .addCase(fetchRepositories.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return

        state.loading = false
        state.currentRequestId = null

        if (!action.meta.aborted) {
          state.error =
            action.payload ??
            '予期しないエラーが発生しました。しばらくしてからもう一度お試しください。'
        }
      })
  }
})

export const {
  clearRepositories,
  setCurrentPage
} = githubRepositorySlice.actions

export default githubRepositorySlice.reducer