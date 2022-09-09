import React from 'react';
import Task from './task';
import {FilterValuesType} from '../App';
import {TaskType} from "./TodoList";
import ControlButtons from "./ControlButtons";
import { List } from '@material-ui/core';

type TasksListPropsType = {
    id: string
    tasks: Array<TaskType>
    removeTask: (taskID: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (title: string) => void
    filter: FilterValuesType
    changeTaskStatus: (taskID: string, isDone: boolean)=>void
    changeTaskTitle : (id: string, title: string, todoListID: string) => void
}

const TasksList = React.memo((props: TasksListPropsType) => {
    
    let tasksForTodoList = props.tasks;
    if (props.filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter(t => t.isDone === false)
    }
    if (props.filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter(t => t.isDone === true)
    }

    const tasksComponentsList = tasksForTodoList.map(task => {
            return (
                <Task
                    todolistId={props.id}
                    key={task.id}
                    {...task}
                    removeTask={props.removeTask}
                    changeTaskStatus={props.changeTaskStatus}
                    changeTaskTitle={props.changeTaskTitle}
                />
            )
        }
    )
    const taskList = tasksComponentsList.length
        ? <List>
            {tasksComponentsList}
        </List>
        : <span>Taskslist with this filter is empty.Please add task or change filter</span>
    return (
        <>
            {taskList}
            <ControlButtons
                filter={props.filter}
                changeFilter={props.changeFilter}/>
        </>

    );
});

export default TasksList;