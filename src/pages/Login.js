import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email, password)
    }


    return (
        <form className='login' onSubmit={handleSubmit}>
            <h3>Login / Register</h3>

            <label><b>Email</b></label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <p className="def-p">Demo Email - guest@gmail.com</p>

            <label><b>Password</b></label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <p className="def-p">Demo Password - Guest123</p>

            <button disabled={isLoading}>Log in</button>
            {error && <div className="error">{error}</div>}
            <p>Not a User ? Get started here ! <a href="\signup"><strong>Register</strong></a></p>
        </form>
    )

}

export default Login