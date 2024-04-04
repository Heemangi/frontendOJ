import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [ error, setError ] = useState(null)
    const [ isLoading, setIsloading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, username) => {
        setIsloading(true)
        setError(null)
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, username})
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
    return {signup, isLoading, error}
}
