import { setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) =>{
    dispatch(setAppStatusAC({status: 'failed'} ))
    dispatch(setAppErrorAC({error: error.message}))
}

export const handleServerAppError = <T> (data: ResponseType<T>, dispatch:Dispatch ) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'some error occured'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}