import React, {useEffect} from 'react'
import './App.css'
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {CircularProgress, LinearProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import CustomizedSnackbars from "../components/ErrorSnackBar/ErrorSnackBar";
import {Routes, Route, Navigate} from 'react-router-dom'
import {Login} from "../features/Login/Login";
import {logoutTC} from "../features/Login/auth-reducer";


function App() {
    const dispatch = useDispatch()
    const isLoggedIn = useAppSelector(state=>state.auth.isLoggedIn)
    const isInitialized = useAppSelector(state=>state.app.isInitialized)
    const status = useAppSelector(state=>state.app.status)
    useEffect(()=>{
        dispatch(initializeAppTC())
    }, [])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
const logOutHandler = () =>{
    dispatch(logoutTC())
}
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button onClick={logOutHandler} color="inherit">Log out</Button>}
                </Toolbar>
                {status==='loading' && <LinearProgress color="secondary" />}
                <CustomizedSnackbars/>
            </AppBar>
            <Container fixed>
                <Routes>
                  <Route path='/' element={ <TodolistsList />}/>
                  <Route path='login' element={ <Login />}/>
                  <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path="*" element={<Navigate to='/404'/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
