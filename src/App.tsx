import React, { useState } from 'react';
import './App.css';
import Todolist, { TaskType } from './Components/TodoList';
import { v1 } from "uuid";
import AddItemForm from './Components/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';


export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todolistID: string]: Array<TaskType>
}

const App = () => {
    const todoListID_1 = v1()
    const todoListID_2 = v1()

    const [todoLists, setTodolists] = useState<Array<TodolistType>>([
        { id: todoListID_1, title: 'What to learn', filter: 'all' },
        { id: todoListID_2, title: 'What to buy', filter: 'all' },
    ])
    const [tasks, setTasks] = useState<TasksStateType>({
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
        const tasksForTodoList = tasks[todoListID] //Array <TodoListType> lenght = 3
        tasks[todoListID] = tasksForTodoList.filter(task => task.id !== taskID) //new Array <TodoListType> lenght = 2

        setTasks({ ...tasks })
    }
    
    const addTask = (title: string, todoListID: string) => {
        const newTask: TaskType = {
            id: v1(), title, isDone: false
        }
        // setTasks(updatedTaks)
        setTasks({ ...tasks, [todoListID]: [newTask, ...tasks[todoListID]] })
    }
    const changeTaskStatus = (taskID: string, isDone: boolean, todoListID: string) => {
        setTasks({ ...tasks, [todoListID]: tasks[todoListID].map(t => t.id === taskID ? { ...t, isDone: !t.isDone } : t) })
    }
  const changeTaskTitle = (id: string, title: string, todoListID: string) => {
        setTasks({
            ...tasks, [todoListID]: tasks[todoListID]
                .map(t => t.id === id ? { ...t, title: title } : t)
        })
    }



    const removeTodoList = (todoListID: string) => {
        setTodolists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
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
        const newTodoListID = v1()
        const newTodolist: TodolistType = {
            id: newTodoListID, title: title, filter: 'all'
        } 
        setTodolists([...todoLists, newTodolist])
        setTasks({ ...tasks, [newTodoListID]: [] })

    }

    const changeFilter = (filter: FilterValuesType, todoListID: string) => {
        setTodolists(todoLists.map(tl => tl.id === todoListID ? { ...tl, filter } : tl))
    }

    const changeTodolistTitle = (title: string, todoListID: string) => {
        setTodolists(todoLists.map(tl => tl.id === todoListID ? { ...tl, title: title } : tl))
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

export default App;
