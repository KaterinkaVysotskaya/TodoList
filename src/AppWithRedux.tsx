import React, { useCallback } from 'react';
import './App.css';
import Todolist, { TaskType } from './Components/TodoList';
import { v1 } from "uuid";
import AddItemForm from './Components/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { AddTodolistAC, ChangeTodolistFilterAT, ChangeTodolistTitleAT, RemoveTodolistAC as removeTodolistAC, todolistsReducer } from './todolists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './tasks-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from './store';


export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todolistID: string]: Array<TaskType>
}

const AppWithRedux = () => {
    console.log('AppWithRedux')

    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)

    const dispatch = useDispatch()

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        let action = removeTaskAC(taskID, todoListID)
        dispatch(action)
    }, [dispatch])

    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskAC(title, todoListID))
    }, [dispatch])
    const changeTaskStatus = useCallback((taskID: string, isDone: boolean, todoListID: string) => {
        dispatch(changeTaskStatusAC(taskID, isDone, todoListID))
    }, [dispatch])
    const changeTaskTitle = useCallback((id: string, title: string, todoListID: string) => {
        dispatch(changeTaskTitleAC(id, title, todoListID))
    }, [dispatch])



    const removeTodoList = useCallback((todoListID: string) => {
        let action = removeTodolistAC(todoListID)
        dispatch(action)
    }, [dispatch])

    // const getFilteredTasksForRender = (todolist: TodolistType) => {
    //     switch (todolist.filter) {
    //         case 'completed':
    //             return tasks[todolist.id].filter(t => t.isDone === true)
    //         case 'active':
    //             return tasks[todolist.id].filter(t => t.isDone === false)
    //         default:
    //             return tasks[todolist.id]
    //     }
    // }

    const addTodolist = useCallback((title: string) => {
        let action = AddTodolistAC(title)
        dispatch(action)
    }, [dispatch])

    const changeFilter = useCallback((filter: FilterValuesType, todoListID: string) => {
        dispatch(ChangeTodolistFilterAT(filter, todoListID))
    }, [dispatch])

    const changeTodolistTitle = useCallback((title: string, todoListID: string) => {
        dispatch(ChangeTodolistTitleAT(title, todoListID))
    }, [dispatch])

    const todoListForRender = todolists.map(tl => {
        // const filteredTasksForRender = getFilteredTasksForRender(tl)
        return (
            <Grid item key={tl.id}>
                <Paper elevation={8} style={{ padding: '15px' }}>
                    <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        tasks={tasks[tl.id]}
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

export default AppWithRedux;
