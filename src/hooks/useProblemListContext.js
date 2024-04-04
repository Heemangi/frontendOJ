import { ProblemsListContext } from "../context/ProblemListContext";
import { useContext } from "react";

export const useProblemListContext = () => {
    const context = useContext(ProblemsListContext)
    if (!context) {
        throw Error('ProblemsListContext must be used inside an ProblemsListContextProvider')
    }
    return context
}