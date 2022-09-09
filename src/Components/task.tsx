import { ListItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { DeleteForever, DeleteOutlineRounded } from '@material-ui/icons';
import React, { ChangeEvent, useCallback } from 'react';
import EditableSpan from './EditableSpan';
import { TaskType } from "./TodoList";


type TaskPropsType = TaskType & {
    todolistId: string
    removeTask: (taskID: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean) => void
    changeTaskTitle: (id: string, title: string, todoListID: string) => void
}

const Task = React.memo((props: TaskPropsType) => {
    console.log('Task')
    const onRemoveHandler = useCallback(() => { 
         props.removeTask(props.id)}, [props.removeTask, props.id])
    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => 
         props.changeTaskStatus(props.id, e.currentTarget.checked), [props.changeTaskStatus, props.id])
    const changeTaskTitle = useCallback((title: string) => 
        props.changeTaskTitle(props.id, title, props.todolistId), [ props.changeTaskTitle, props.id, props.todolistId])

    return (
        <ListItem className={props.isDone ? 'is-done' : ''} >
            <Checkbox
                size={'small'}
                color={'primary'}
                checked={props.isDone}
                onChange={changeTaskStatus} />

            {/* <span className={props.isDone ? 'is-done': ''}>{props.title}</span> */}
            <EditableSpan title={props.title}
                changeTitle={changeTaskTitle}
            />
            <IconButton onClick={onRemoveHandler}
                size={'small'}
            >
                <DeleteOutlineRounded />
            </IconButton>
        </ListItem>
    )
});

export default Task;