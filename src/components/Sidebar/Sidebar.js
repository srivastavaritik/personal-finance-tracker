import React from 'react'
import './Sidebar.css'
import { auth } from '../../firebase';
import { useNavigate } from 'react-router';

const Sidebar = ({isAuth, setIsAuth}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Handle logout logic here
        // localStorage.setItem("isAuth", false);
        setIsAuth(false);
        auth.signOut();
        navigate('/login');
    };
  return (
    <div class='sidebar-container'>
        <h1>Finance Tracker</h1>
        <ul>
            {isAuth && <li onClick={() => navigate('/transactions')}>Transactions</li>}
            {isAuth && <li onClick={() => navigate('/add-expense')}>Add Expenses</li>}
            {isAuth && <li onClick={() => navigate('/add-income')}>Add Incomes</li>}
            {!isAuth && <li onClick={() => navigate('/login')}>Login</li>}
            {isAuth && <li onClick={handleLogout}>Logout</li>}
        </ul>
    </div>
  )
}

export default Sidebar;