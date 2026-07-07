
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login/', credentials)
            const { access, refresh } = response.data
            localStorage.setItem('access_token', access)
            localStorage.setItem('refresh_token', refresh)
            localStorage.setItem('username', credentials.username)


            localStorage.setItem('is_staff', 'true')

            return { user: { username: credentials.username, is_staff: true } }
        } catch (error) {
            return rejectWithValue('Invalid username or password')
        }
    }
)


export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                return { isAuthenticated: false, user: null }
            }
            const username = localStorage.getItem('username') || 'User'
            const isStaff = localStorage.getItem('is_staff') === 'true'
            return {
                isAuthenticated: true,
                user: { username, is_staff: isStaff }
            }
        } catch (error) {
            return rejectWithValue('Auth check failed')
        }
    }
)
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register/', userData)
            return { success: true }
        } catch (error) {
            let errorMessage = 'Registration failed'
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            } else if (error.response?.data?.non_field_errors) {
                errorMessage = error.response.data.non_field_errors[0]
            } else if (error.response?.data?.username) {
                errorMessage = error.response.data.username[0]
            } else if (error.response?.data?.email) {
                errorMessage = error.response.data.email[0]
            } else if (error.response?.data?.password) {
                errorMessage = error.response.data.password[0]
            }
            return rejectWithValue(errorMessage)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('username')
        return {}
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        checking: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.checking = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.checking = false
                state.isAuthenticated = action.payload.isAuthenticated
                state.user = action.payload.user
            })
            .addCase(checkAuth.rejected, (state) => {
                state.checking = false
                state.isAuthenticated = false
                state.user = null
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.isAuthenticated = false
                state.user = null
                state.error = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.loading = false
                state.error = null
            })
    }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer