import { TasksStateType, TodolistType } from "./App";
import { tasksReducer } from "./tasks-reducer";
import { AddTodolistAC, todolistsReducer, RemoveTodolistAC } from "./todolists-reducer";



test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}; //создается пустой объект для тасок
    const startTodolistsState: Array<TodolistType> = []; //создается пустой массив для тудулистов
 
    const action = AddTodolistAC("new todolist");
 
    const endTasksState = tasksReducer(startTasksState, action) // объект с одним свойством, значение которого - пустой массив
    const endTodolistsState = todolistsReducer(startTodolistsState, action) //массив с одним элментом
 
    const keys = Object.keys(endTasksState); //массив с одним элементом
    const idFromTasks = keys[0]; //строка из массива
    const idFromTodolists = endTodolistsState[0].id; //строка из объекта
 
    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
 });


 
 
test('property with todolistId should be deleted', () => {
    const startTasksState: TasksStateType = {
        "todolistId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todolistId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "2", title: "milk", isDone: true },
            { id: "3", title: "tea", isDone: false }
        ]
    };
 
    const action = RemoveTodolistAC("todolistId2");
 
    const endState = tasksReducer(startTasksState, action)
 
 
    const keys = Object.keys(endState);
 
    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
 });
 
 