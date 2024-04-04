import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => {
        logout();
    }

    return (
        <header>    
            <div className="container">   
                <Link to={`${process.env.REACT_BACKEND_URL}/`}>  
                    <h1>SolveX - The Online Judge</h1>
                </Link>

                <nav>
                    {user && (
                        <div className='user-info'>
                            <a className='videolink' href="https://drive.google.com/file/d/1wWEZ31d1YjDXky_7eIGtNGdOjS1NMCWY/view?usp=drive_link">Demo Video</a>
                            <span>{user.email}</span>
                            <button className='logout' onClick={handleClick}>Log Out</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
