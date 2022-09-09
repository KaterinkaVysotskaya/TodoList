import { v1 } from "uuid"
import { FilterValuesType, TodolistType } from "./App"

export type RemoveTodolistAT = {
type: 'REMOVE-TODOLIST'
id: string
}

 export type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}
type ChangeTodolistFilterAT = {
    type:'CHANGE-TODO-FILTER'
    filter: FilterValuesType
    id: string
}
type ChangeTodolistTitleAT = {
    type:'CHANGE-TODOLIST-TITLE'
    title: string
    todoListID: string
}



export  type ActionType = RemoveTodolistAT | AddTodolistAT | ChangeTodolistFilterAT | ChangeTodolistTitleAT

const initialState:Array <TodolistType> = []

export const todolistsReducer = (todoLists: Array <TodolistType> = initialState, action: ActionType) : Array <TodolistType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return todoLists.filter(tl => tl.id !== action.id)

        
        case 'ADD-TODOLIST' :
            return [...todoLists, 
                {id: action.todolistId, title: action.title, filter: 'all'}]
        
        case 'CHANGE-TODO-FILTER':
            return todoLists.map(tl => tl.id === action.id ? { ...tl, filter: action.filter } : tl)
        
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tl => tl.id === action.todoListID ? { ...tl, title: action.title } : tl)
        
                default:
            return todoLists

        
    }
}

export const RemoveTodolistAC = (id: string): RemoveTodolistAT=>{
    return  {
        type: 'REMOVE-TODOLIST',
        id: id
    }
}

export const AddTodolistAC = (title: string) : AddTodolistAT =>{  
   return {
       type: 'ADD-TODOLIST', 
       title,
       todolistId: v1()
    }
} 
export const ChangeTodolistFilterAT = (filter: FilterValuesType, id: string) : ChangeTodolistFilterAT => ({type: 'CHANGE-TODO-FILTER', filter, id})
export const ChangeTodolistTitleAT = (title: string, todoListID: string) : ChangeTodolistTitleAT => ({type: 'CHANGE-TODOLIST-TITLE',title,  todoListID})