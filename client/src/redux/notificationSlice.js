import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationAPI } from '../services/api'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (token) => {
    return notificationAPI.getMyNotifications(token)
  },
)

export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async (token) => {
    return notificationAPI.getUnreadCount(token)
  },
)

const notificationSlice = createSlice({
  name: 'notifications',

  initialState: {
    items: [],
    unread: 0,
    loading: false,
  },

  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload)
      state.unread += 1
    },

    markReadLocal: (state, action) => {
      const item = state.items.find((x) => x.id === action.payload)

      if (item && !item.isRead) {
        item.isRead = true
        state.unread--
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unread = action.payload.unread
      })
  },
})

export const { addNotification, markReadLocal } = notificationSlice.actions

export default notificationSlice.reducer
