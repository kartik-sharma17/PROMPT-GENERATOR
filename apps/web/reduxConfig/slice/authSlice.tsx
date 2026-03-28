import { createSlice } from "@reduxjs/toolkit";

interface SubscriptionDetailsType {
    planId?: string;
    planName?: string;
    planPrice: number;
    planDuration: number;
    planDailyLimit: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface AuthState {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
    subscriptionDetails: SubscriptionDetailsType | null;
}

const initialState: AuthState = {
    user: {},
    token: null,
    isAuthenticated: false,
    subscriptionDetails: null,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.subscriptionDetails = action.payload.subscriptionDetails
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = {}
            state.token = null
            state.subscriptionDetails = null
            state.isAuthenticated = false
        }
    }
})

export const { setCredentials, logout } = AuthSlice.actions
export default AuthSlice.reducer