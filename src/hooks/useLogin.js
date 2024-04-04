import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [ error, setError ] = useState(null)
    const [ isLoading, setIsloading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setIsloading(true)
        setError(null)
        console.log(process.env.REACT_BACKEND_URL)
        const response = await fetch('/api/users/login' ,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const json = await response.json()

        // json contains ok property
        if (!response.ok){
            setIsloading(false)
            setError(json.error)
        }
        if (response.ok){
            // save jwt token and email to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update auth context
            dispatch({type: 'LOGIN', payload: json})

            setIsloading(false)
        }
    }
    return {login, isLoading, error}
}
