import { TextField } from '@material-ui/core';
import React, { ChangeEvent, FC, PropsWithChildren, useState } from 'react';

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
   
}   

const EditableSpan: React.FC<EditableSpanPropsType> = React.memo((props:PropsWithChildren <EditableSpanPropsType>) => {
    console.log('EditableSpan')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(props.title)
    const onEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const offEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.currentTarget.value)
    }

    return (
        editMode
        ? <TextField 
                value = {title}
                onChange={onChangeHandler}
                 onBlur ={offEditMode}
                 autoFocus />
        : <span  onDoubleClick={onEditMode}>{props.title}</span>
    )
    })
export default EditableSpan;