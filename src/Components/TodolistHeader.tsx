import IconButton from '@material-ui/core/IconButton/IconButton';
import { DeleteOutlineRounded } from '@material-ui/icons';
import React from 'react';
import AddItemForm from "./AddItemForm";
import EditableSpan from './EditableSpan';

type TodolistHeaderType = {
    id: string
    title: string
    addTask: (title:string)=>void
    removeTodoList: ()=>void
    changeTodolistTitle: (title: string, todoListID: string) => void
}

const TodolistHeader = React.memo((props: TodolistHeaderType) => {
    const changeTodolistTitle = (title: string) => props.changeTodolistTitle(title, props.id)
    return (
            <div>
                <h3>
                <EditableSpan title={props.title} changeTitle={changeTodolistTitle} />
                 <IconButton onClick={props.removeTodoList}
                            size={'small'}>
                    <DeleteOutlineRounded />     
                </IconButton>
                </h3>
                <div>
                  <AddItemForm addItem={props.addTask}/>  
                </div>
               
              
            </div>
        )



});

export default TodolistHeader;

