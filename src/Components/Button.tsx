import React from 'react';
import {FilterValuesType} from "../App";

type ButtonPropsType ={
    title:  string
    changeFilter:(filter: FilterValuesType)=>void
}
const Button = (props: ButtonPropsType) => {
    return   <button onClick={()=>props.changeFilter('all')}>{props.title}</button>
};

export default Button;