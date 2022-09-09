import React, { useReducer, useState } from 'react';
import './App.css';
import Todolist, { TaskType } from './Components/TodoList';
import { v1 } from "uuid";
import AddItemForm from './Components/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { AddTodolistAC, ChangeTodolistFilterAT, ChangeTodolistTitleAT, RemoveTodolistAC as removeTodolistAC, todolistsReducer } from './todolists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './tasks-reducer';


export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todolistID: string]: Array<TaskType>
}

const AppWithReducers = () => {
    const todoListID_1 = v1()
    const todoListID_2 = v1()

    const [todoLists, dispatchToTodolists] = useReducer(todolistsReducer, [
        { id: todoListID_1, title: 'What to learn', filter: 'all' },
        { id: todoListID_2, title: 'What to buy', filter: 'all' },
    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListID_1]: [
            { id: v1(), title: 'HTML/CSS', isDone: true },
            { id: v1(), title: 'JS/ES6', isDone: true },
            { id: v1(), title: 'REACT', isDone: false },
        ],
        [todoListID_2]: [
            { id: v1(), title: 'Book', isDone: true },
            { id: v1(), title: 'Milk', isDone: true },
            { id: v1(), title: 'Bread', isDone: false },
        ]
    })


    const removeTask = (taskID: string, todoListID: string) => {
        let action = removeTaskAC(taskID, todoListID)
        dispatchToTasks(action)
        dispatchToTasks(removeTaskAC(taskID, todoListID))
    }
    
    const addTask = (title: string, todoListID: string) => {
        dispatchToTasks(addTaskAC(title, todoListID))
    }
    const changeTaskStatus = (taskID: string, isDone: boolean, todoListID: string) => {
        dispatchToTasks(changeTaskStatusAC(taskID, isDone, todoListID ))
    }
  const changeTaskTitle = (id: string, title: string, todoListID: string) => {
        dispatchToTasks(changeTaskTitleAC(id, title, todoListID))
    }



    const removeTodoList = (todoListID: string) => {
        let action = removeTodolistAC(todoListID)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const getFilteredTasksForRender = (todolist: TodolistType) => {
        switch (todolist.filter) {
            case 'completed':
                return tasks[todolist.id].filter(t => t.isDone === true)
            case 'active':
                return tasks[todolist.id].filter(t => t.isDone === false)
            default:
                return tasks[todolist.id]
        }
    }

    const addTodolist = (title: string) => {
        let action = AddTodolistAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const changeFilter = (filter: FilterValuesType, todoListID: string) => {
          dispatchToTodolists(ChangeTodolistFilterAT(filter, todoListID))
    }

    const changeTodolistTitle = (title: string, todoListID: string) => {
        dispatchToTodolists(ChangeTodolistTitleAT(title, todoListID))
    }

    const todoListForRender = todoLists.map(tl => {
        const filteredTasksForRender = getFilteredTasksForRender(tl)
        return (
            <Grid item>
                <Paper elevation={8} style={{ padding: '15px' }}>
                    <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        tasks={filteredTasksForRender}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        filter={tl.filter}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                </Paper>
            </Grid>
        )
    })
    //UI (interface):
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"

                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" >
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container style={{ padding: '20px' }} >
                    <AddItemForm addItem={addTodolist} />
                </Grid>
                <Grid container spacing={3}>
                    {todoListForRender}
                </Grid>

            </Container>

        </div>
    );
}

export default AppWithReducers;
