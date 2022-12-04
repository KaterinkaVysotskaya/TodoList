import {addTodolistTC, fetchTodolistsTC, removeTodolistTC,} from './todolists-reducer'
import {
    RESULT_CODE,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppRootStateType} from '../../app/store'
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks, todolistId}
    }
)
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {taskId: param.taskId, todolistId: param.todolistId}
})


export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === RESULT_CODE.succeeded) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data.data.item
        } else {
            handleServerAppError<{ item: TaskType }>(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error) {
        const e = error as AxiosError
        handleServerNetworkError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [e.message], fieldsErrors: undefined})
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string}, thunkAPI) => {
        const state = thunkAPI.getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
        if (!task) {
            return thunkAPI.rejectWithValue('task is not found in the state')
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.domainModel
        }
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
                if (res.data.resultCode === RESULT_CODE.succeeded) {
                    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {param}
                } else {
                    handleServerAppError(res.data, thunkAPI.dispatch)
                }
    } catch (error) {
        const e = error as Error | AxiosError
        if (axios.isAxiosError(e)) {
            const error = e.response?.data
                ? (e.response.data as { error: string }).error
                : e.message
            thunkAPI.dispatch(setAppErrorAC({error: error}))
            return thunkAPI.rejectWithValue({errors: [e.message], fieldsErrors: undefined})
        }
        handleServerNetworkError(e, thunkAPI.dispatch)
    }
})
// export const addTaskTC_ = (title: string, todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     todolistsAPI.createTask(todolistId, title)
//         .then(res => {
//             if (res.data.resultCode === RESULT_CODE.succeeded) {
//                 const task = res.data.data.item
//                 const action = addTaskAC({task})
//                 dispatch(action)
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError<{ item: TaskType }>(res.data, dispatch)
//             }
//         })
//         .catch((e: AxiosError) => {
//             const error = e.response
//                 ? (e.response.data as ({ error: string })).error
//                 : e.message
//             handleServerNetworkError(e, dispatch)
//         })
// }
// export const updateTaskTC_ = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
//     (dispatch: Dispatch, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasks[todolistId].find(t => t.id === taskId)
//         if (!task) {
//             //throw new Error("task not found in the state");
//             console.warn('task not found in the state')
//             return
//         }
//
//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...domainModel
//         }
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todolistsAPI.updateTask(todolistId, taskId, apiModel)
//             .then(res => {
//                 if (res.data.resultCode === RESULT_CODE.succeeded) {
//                     const action = updateTaskAC({taskId, model: domainModel, todolistId})
//                     dispatch(action)
//                     dispatch(setAppStatusAC({status: 'succeeded'}))
//                 } else {
//                     handleServerAppError(res.data, dispatch)
//                 }
//             })
//             .catch((e) => {
//                 const err = e as Error | AxiosError
//                 if (axios.isAxiosError(err)) {
//                     const error = err.response?.data
//                         ? (err.response.data as { error: string }).error
//                         : err.message
//                     dispatch(setAppErrorAC({error: error}))
//                 }
//                 handleServerNetworkError(e, dispatch)
//             })
//     }

//         .catch((e: AxiosError) => {
//             const error = e.response
//                 ? (e.response.data as ({ error: string })).error
//                 : e.message
//             // dispatch(setAppErrorAC(error))
//             handleServerNetworkError(e, thunkAPI.dispatch)
//         })
// })
// export const removeTaskTC_ = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     todolistsAPI.deleteTask(todolistId, taskId)
//         .then(res => {
//             if (res.data.resultCode === RESULT_CODE.succeeded) {
//                 dispatch(removeTaskAC({taskId, todolistId}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         }).catch((e: AxiosError) => {
//         const error = e.response
//             ? (e.response.data as ({ error: string })).error
//             : e.message
//         // dispatch(setAppErrorAC(error))
//         handleServerNetworkError(e, dispatch)
//         dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'failed'}))
//     })
// }
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
        //     const tasks = state[action.payload.todolistId]
        //     const index = tasks.findIndex(t => t.id === action.payload.taskId)
        //     if (index > -1) {
        //         tasks.splice(index, 1)
        //     }
        // },
        // addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
        //     state[action.payload.task.todoListId].unshift(action.payload.task)
        // },
        // updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
        //     const tasks = state[action.payload.todolistId]
        //     const index = tasks.findIndex(t => t.id === action.payload.taskId)
        //     if (index > -1) {
        //         tasks[index] = {...tasks[index], ...action.payload.model}
        //     }
        // },
        // setTasksAC(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}>){
        //     state[action.payload.todolistId] = action.payload.tasks
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            if(action.payload)
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            if(action.payload)
            delete state[action.payload.id]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            if (action.payload)
            action.payload.todolists.forEach((tl: any) => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTaskTC.fulfilled,(state, action) =>{
            if (action.payload) {
                const tasks = state[action.payload.param.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload!.param.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.param.domainModel}
                }
            }

        })
    }
})

export const tasksReducer = slice.reducer

// export const _tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
//         case 'ADD-TASK':
//             return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//         case 'UPDATE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
//             }
//         case 'ADD-TODOLIST':
//             return {...state, [action.todolist.id]: []}
//         case 'REMOVE-TODOLIST':
//             const copyState = {...state}
//             delete copyState[action.id]
//             return copyState
//         case 'SET-TODOLISTS': {
//             const copyState = {...state}
//             action.todolists.forEach(tl => {
//                 copyState[tl.id] = []
//             })
//             return copyState
//         }
//         case 'SET-TASKS':
//             return {...state, [action.todolistId]: action.tasks}
//         default:
//             return state
//     }
// }

// actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//     ({type: 'REMOVE-TASK', taskId, todolistId} as const)
// export const addTaskAC = (task: TaskType) =>
//     ({type: 'ADD-TASK', task} as const)
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
//     ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
//     ({type: 'SET-TASKS', tasks, todolistId} as const)

// thunks
// export const fetchTasksTC_ = (todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     todolistsAPI.getTasks(todolistId)
//         .then((res) => {
//             dispatch(setTasksAC({tasks: res.data.items, todolistId}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         })
//         .catch((e: AxiosError) => {
//             const error = e.response
//                 ? (e.response.data as ({ error: string })).error
//                 : e.message
//             // dispatch(setAppErrorAC(error))
//             handleServerNetworkError(e, dispatch)
//         })
// }


// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
// type ActionsType =
//     | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof addTaskAC>
//     | ReturnType<typeof updateTaskAC>
//     | AddTodolistActionType
//     | RemoveTodolistActionType
//     | SetTodolistsActionType
//     | ReturnType<typeof setTasksAC>
//     | ReturnType<typeof setAppStatusAC>
//     | ReturnType<typeof setAppErrorAC>
//     | ReturnType<typeof changeTodolistEntityStatusAC>
