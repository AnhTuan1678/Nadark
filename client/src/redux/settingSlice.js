import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light', // 'light' | 'dark'
  fontFamily: 'Arial',
  snowEffect: true, // bật/tắt hiệu ứng tuyết
  snowSettings: {
    countFactor: 41472, // màn hình 1920*1080 ~ 50 bông
    minSize: 10,
    maxSize: 20,
    minSpeed: 0.5,
    maxSpeed: 2,
    swingAmplitude: 50,
    swingSpeedMin: 0.01,
    swingSpeedMax: 0.03,
  },
  // === TTS & Reader Settings ===
  reader: {
    speed: 1,
    voiceName: null,
    autoNextChapter: false,
  },
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
    },
    toggleSnowEffect: (state) => {
      state.snowEffect = !state.snowEffect
    },
    updateSnowSettings: (state, action) => {
      state.snowSettings = { ...state.snowSettings, ...action.payload }
    },
    setReaderSpeed: (state, action) => {
      state.reader.speed = action.payload
    },
    setReaderVoice: (state, action) => {
      state.reader.voiceName = action.payload
    },
    toggleAutoNextChapter: (state) => {
      state.reader.autoNextChapter = !state.reader.autoNextChapter
    },
  },
})

export const {
  toggleTheme,
  setFontFamily,
  toggleSnowEffect,
  updateSnowSettings,
  setReaderSpeed,
  setReaderVoice,
  toggleAutoNextChapter,
} = settingSlice.actions
export default settingSlice.reducer
