import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldErrorType, LoginParamsType, RESULT_CODE} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// thunks

export const loginTC = createAsyncThunk<undefined ,LoginParamsType, {rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }}>('auth/login', async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await authAPI.login(param)
            if (res.data.resultCode === RESULT_CODE.succeeded) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (err) {
            const e = err as AxiosError
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [e.message], fieldsErrors: undefined})
        }
    }
)

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch(error) {
            const e = error as AxiosError
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [e.message], fieldsErrors: undefined})
        }
    }
)
const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value  //stateDraft
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})

export const authReducer = slice.reducer

export const {setIsLoggedInAC} = slice.actions


// export const logoutTC_ = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.logout()
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: false}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }
// export const loginTC_ = (data: LoginParamsType) => async (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     try {
//         const res = await authAPI.login(data)
//         if (res.data.resultCode === RESULT_CODE.succeeded) {
//             dispatch(setIsLoggedInAC({value: true}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         } else {
//             handleServerAppError(res.data, dispatch)
//         }
//     } catch (e) {
//         if (axios.isAxiosError(e)) {
//             handleServerNetworkError(e, dispatch)
//         }
//     }
// }


// type InitialStateType = typeof initialState

/*(state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}*/
// actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)


// types
// type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType