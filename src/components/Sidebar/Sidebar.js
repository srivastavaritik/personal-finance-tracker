import React from 'react'
import './Sidebar.css'
import { auth } from '../../firebase';
import { useNavigate } from 'react-router';
import { signOut } from '@firebase/auth';

const Sidebar = ({isAuth, setIsAuth}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Handle logout logic here
        signOut(auth).then(() => {
            localStorage.clear();
            setIsAuth(false);
            navigate("/login");
        });
    };
  return (
    <div className='sidebar-container'>
        <div className='hCont'>
            <span>Finance Tracker</span>
            <span>H</span>
        </div>
        <ul>
            {isAuth && <li onClick={() => navigate('/transactions')}>Transactions</li>}
            {isAuth && <li onClick={() => navigate('/add-expense')}>Add Expenses</li>}
            {isAuth && <li onClick={() => navigate('/add-income')}>Add Incomes</li>}
            {isAuth && <li onClick={() => navigate('/stats')}>Stats</li>}
            {!isAuth && <li onClick={() => navigate('/login')}>Login</li>}
            {isAuth && <li onClick={handleLogout}>Logout</li>}
        </ul>
    </div>
  )
}

export default Sidebar;