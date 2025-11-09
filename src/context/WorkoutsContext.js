import {createContext, useReducer} from 'react';

export const WorkoutsContext = createContext()

export const workoutsReducer=(state,action)=>{
    switch(action.type){
        case 'SET_WORKOUT':
            return {
                ...state,
                workouts:action.payload
            }
        case 'CREATE_WORKOUT':
            return {
                ...state,
                workouts:[action.payload,...state.workouts]
            }
        case 'DELETE_WORKOUT':
            return {
                ...state,
                workouts:state.workouts.filter((w)=>w._id!==action.payload._id)
            }
        case 'SET_EDIT':
            return {
                ...state,
                editingWorkout: action.payload
            }
        case 'CLEAR_EDIT':
            return {
                ...state,
                editingWorkout: null
            }
        case 'UPDATE_WORKOUT':
            return {
                ...state,
                workouts: state.workouts.map(w => w._id === action.payload._id ? action.payload : w),
                editingWorkout: null
            }
        default :
            return state
    }
}

export const WorkoutsContextProvider =({children})=>{
    // initialize workouts as an empty array and no editing target
    const [state,dispatch]=useReducer(workoutsReducer, {workouts: [], editingWorkout: null})

    return (
        <WorkoutsContext.Provider value={{...state,dispatch}}>
            {children}
        </WorkoutsContext.Provider>
    )
}