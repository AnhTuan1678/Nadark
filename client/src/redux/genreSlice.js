import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { genreApi } from '../services/api'

// Gọi API lấy tất cả thể loại
export const fetchGenres = createAsyncThunk(
  'genre/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await genreApi.getAll()
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

const genreSlice = createSlice({
  name: 'genre',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Không thể tải danh sách thể loại'
      })
  },
})

export default genreSlice.reducer
