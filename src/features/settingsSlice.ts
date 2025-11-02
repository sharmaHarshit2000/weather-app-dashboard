import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


type SettingsState = { unit: 'metric' | 'imperial' }
const initial: SettingsState = { unit: (localStorage.getItem('unit') as 'metric'|'imperial') || 'metric' }


const settingsSlice = createSlice({
name: 'settings',
initialState: initial,
reducers: {
setUnit: (state, action: PayloadAction<'metric'|'imperial'>) => {
state.unit = action.payload
localStorage.setItem('unit', action.payload)
}
}
})


export const { setUnit } = settingsSlice.actions
export default settingsSlice.reducer