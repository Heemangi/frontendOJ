// to keep local state in sync with the data updates made in db
import { createContext, useReducer } from "react";

export const ProblemsListContext = createContext()

export const problemsListReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROBLEMS': 
            return {
                problems: action.payload
            }
        case 'CREATE_PROBLEM':
            return {
                problems: [action.payload, ...state.problems]
            }
        case 'DELETE_PROBLEM':
            return {
                problems: state.problems.filter((p) => p._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const ProblemsListContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(problemsListReducer, {
        problems: null  // inital value
    })

    return (
        <ProblemsListContext.Provider value={{...state, dispatch}}>
            { children }
        </ProblemsListContext.Provider>
    )
}
