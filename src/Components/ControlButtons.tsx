import { Button, ButtonGroup } from '@material-ui/core';
import React, { useCallback } from 'react';
import { FilterValuesType } from "../App";

type ControlButtonsType = {
        filter: FilterValuesType
        changeFilter: (filter: FilterValuesType) => void
}
        const ControlButtons = React.memo((props: ControlButtonsType) => {
        const onClickSetFilter = useCallback((filter: FilterValuesType) => () => props.changeFilter(filter),[ props.changeFilter])
        return (
                <div>
                        <ButtonGroup 
                        size ={'small'}
                        variant={'contained'}
                        
                        >
                            <Button
                                variant={props.filter==='all' ? 'contained' : 'text'}
                                className={props.filter === 'all' ? 'active-filter' : ''}
                                onClick={onClickSetFilter('all')}>All

                                </Button>

                        <Button 
                                variant={props.filter==='active' ? 'contained' : 'text'}
                                color={'primary'}
                                className={props.filter === 'active' ? 'active-filter' : ''}
                                onClick={onClickSetFilter('active')}>Active
                                </Button>
                        <Button 
                                variant={props.filter==='completed' ? 'contained' : 'text'}
                                color={'secondary'}
                                className={props.filter === 'completed' ? 'active-filter' : ''}
                                onClick={onClickSetFilter('completed')}>Completed
                                </Button>     
                        </ButtonGroup>
                       
                </div>
        )
});

export default ControlButtons;