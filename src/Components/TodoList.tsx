import React, { useCallback } from 'react';
import TodolistHeader from './TodolistHeader';
import {FilterValuesType} from '../App';
import TasksList from "./TaskList";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array <TaskType>
    removeTask: (taskID: string, todolist: string) =>void, 
    changeFilter: (filter: FilterValuesType, todolist: string)=>void
    addTask: (title:string, todolist: string)=>void
    filter: FilterValuesType
    changeTaskStatus:(taskID: string, isDone: boolean, todolist: string)=>void
    removeTodoList :(todoListID: string)=>void
    changeTaskTitle : (id: string, title: string, todoListID: string) => void
    changeTodolistTitle: (title: string, todoListID: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
const Todolist = React.memo((props: TodoListPropsType) => {
    const addTask = useCallback ((title: string) =>  props.addTask(title, props.id), [props.addTask,  props.id])
    const removeTask =  useCallback((taskID: string) =>props.removeTask(taskID, props.id), [props.removeTask, props.id])
    const changeFilter = (filter: FilterValuesType) => props.changeFilter(filter, props.id)
    const changeTaskStatus =  useCallback((taskID: string, isDone: boolean)=> props.changeTaskStatus(taskID, isDone, props.id), [props.changeTaskStatus, props.id ])
    const removeTodoList= useCallback( () => props.removeTodoList(props.id), [props.removeTodoList, props.id])
    

    return (
        <div>
            <TodolistHeader id={props.id}
                            title={props.title}
                            addTask={addTask}
                            removeTodoList={removeTodoList}
                            changeTodolistTitle={props.changeTodolistTitle}
                            />
            <TasksList
                id={props.id}
                tasks={props.tasks}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                filter={props.filter}
                changeTaskStatus={changeTaskStatus} 
                changeTaskTitle={props.changeTaskTitle}

            />
            </div>  

    );
});

export default Todolist;