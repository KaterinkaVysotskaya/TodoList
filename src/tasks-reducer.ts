import { v1 } from "uuid"
import { FilterValuesType, TasksStateType, TodolistType } from "./App"
import { AddTodolistAT, RemoveTodolistAT } from "./todolists-reducer"

type RemoveTaskAT = {
type: 'REMOVE-TASK'
taskId: string
todolistId: string

}

type AddTaskAT = {
    type: 'ADD-TASK'
    title:string
    todolistId: string
}
type ChangeTaskAT = {
    type: 'CHANGE-TASK'
    taskId: string
    isDone:boolean
    todolistId: string
}
type ChangeTaskTitleAT = {
    type: 'CHANGE-TASK-TILTLE'
    taskId: string
    title:string
    todolistId: string
}



export type ActionType = RemoveTaskAT | AddTaskAT | ChangeTaskAT | ChangeTaskTitleAT | AddTodolistAT | RemoveTodolistAT

const initialState:TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType) : TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t=>t.id!==action.taskId)
            }
        }
        case 'ADD-TASK' : {
            return {
                ...state,
                [action.todolistId]: [{id:v1(), title: action.title, isDone: false }, ...state[action.todolistId]]

            }
        }
         
        case 'CHANGE-TASK':
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? { ...t, isDone: !t.isDone } : t)
            }
        
        case 'CHANGE-TASK-TILTLE':
            return {...state,
                [action.todolistId]: state[action.todolistId]
                .map(t => t.id === action.taskId ? { ...t, title: action.title } : t)
            }
        case 'ADD-TODOLIST':
            return {...state,
                [action.todolistId]:[]
            } 
        case 'REMOVE-TODOLIST':
            // const {[action.id]:[],...rest} ={...state}
            let newState = {...state}
            delete newState[action.id]
            return newState
        
                default:
           return state

        
    }
}

export const removeTaskAC = (taskId: string, todolistId: string ): RemoveTaskAT=>{
    return  { type: 'REMOVE-TASK', taskId, todolistId}
}

export const addTaskAC = (title: string, todolistId: string) : AddTaskAT => ({type: 'ADD-TASK', todolistId, title})
export const changeTaskStatusAC = (taskId: string, isDone:boolean, todolistId: string) : ChangeTaskAT => ({type: 'CHANGE-TASK',isDone,taskId,todolistId})
export const changeTaskTitleAC = (taskId: string, title:string, todolistId: string) : ChangeTaskTitleAT => ({type: 'CHANGE-TASK-TILTLE',taskId,title,todolistId})

