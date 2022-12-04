import {authAPI, RESULT_CODE} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initializeAppTC = createAsyncThunk('app/initialiseApp', async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            let res = await authAPI.me()
            if (res.data.resultCode === RESULT_CODE.succeeded) {
                thunkAPI.dispatch(setIsLoggedInAC({value: true}))
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (error) {
            const e = error as AxiosError
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [e.message], fieldsErrors: undefined})

        } finally {

        }
    }
)
// export const initializeAppTC_ = () => async (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     try {
//         let res = await authAPI.me()
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
//     } finally {
//         dispatch(setAppIitialisedAC({isInitialized: true}))
//     }
// }

type initialStateType = {
    status:  RequestStatusType
    error: null | string
    isInitialized: boolean
}

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    } as initialStateType,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: (builder ) => {
        builder.addCase(initializeAppTC.fulfilled, (state)=>{
            state.isInitialized = true
        })
    }
})

// type InitialStateType = typeof initialState

export const appReducer = slice.reducer/*(state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case APP_SET_STATUS:
            return {...state, status: action.status}
        case APP_SET_ERROR:
            return {...state, error: action.error}
        case APP_SET_INITIALISED:
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}*/
export const {setAppStatusAC, setAppErrorAC} = slice.actions


// export const setAppStatusAC =(status: RequestStatusType)=>({type:APP_SET_STATUS, status} as const)
//
// export const setAppErrorAC = (error: string | null) => ({type: APP_SET_ERROR, error} as const)
// export const setAppIitialisedAC = (isInitialized: boolean) => ({type: APP_SET_INITIALISED, isInitialized} as const)


// export type AppActionsType =
//     |ReturnType <typeof setAppStatusAC>
//     |ReturnType <typeof setAppErrorAC>
//     |ReturnType <typeof setAppIitialisedAC>