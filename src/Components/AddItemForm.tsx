import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { PostAdd } from '@material-ui/icons';
import React, {ChangeEvent, useState, MouseEvent, KeyboardEvent} from 'react';

type AddItemPropsType = {
    addItem: (title: string) => void
   
}

const AddItemForm: React.FC<AddItemPropsType> = React.memo( ({addItem: addItem}) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const onClickAddItemHandler = () => {
        const trimmedTask = title.trim()
        if(trimmedTask) {
            addItem(title)
        } else {
            setError(true)
        }

        setTitle('')

    }
    const onChangeSetTitle = (e:ChangeEvent<HTMLInputElement>)=> {
        setTitle(e.currentTarget.value)
        if (error) setError(false)
    }
    const onKeyPressSetTitle = (e: KeyboardEvent<HTMLInputElement>)=>{
        e.key ==='Enter' && onClickAddItemHandler()
    }

    return (
        <div style={{display:'flex', alignItems: 'center'}}>
            <TextField
                variant={'outlined'}
                label={'Title'}
                value={title}
                onChange={onChangeSetTitle}
                onKeyPress ={onKeyPressSetTitle}
                error={!!error}
                helperText={error}
            />
            <IconButton 
                    onClick={onClickAddItemHandler}
                    color={'primary'}
                    >
                <PostAdd/>
            </IconButton>
            
        </div>
    )


});

export default AddItemForm;