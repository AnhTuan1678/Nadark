import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: null,
  id: null,
  token: null,
  urlAvar: null,
  isLoggedIn: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, token, id, urlAvar } = action.payload
      state.username = username
      state.token = token
      state.id = id
      state.urlAvar = urlAvar
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.username = null
      state.token = null
      state.id = null
      state.urlAvar = null
      state.isLoggedIn = false
    },
    updateToken: (state, action) => {
      state.token = action.payload
    },
  },
})

export const { login, logout, updateToken } = userSlice.actions
export default userSlice.reducer
