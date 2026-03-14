import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        user: {},
        token: null,
        isAuthenticated: false
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = {}
            state.token = null
            state.isAuthenticated = false
        }
    }
})

export const { setCredentials, logout } = AuthSlice.actions
export default AuthSlice.reducer