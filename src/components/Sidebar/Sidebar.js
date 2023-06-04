import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { auth } from '../../firebase';
import { useNavigate } from 'react-router';
import { signOut } from '@firebase/auth';

const Sidebar = ({isAuth, setIsAuth}) => {
    const [toggleSidebar, setToggleSidebar] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if(window.innerWidth < 500){
            setToggleSidebar(false);
        }
    }, [])
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
            <span onClick={()=>setToggleSidebar(!toggleSidebar)} className='ham'>III</span>
        </div>
        {toggleSidebar && <ul>
            {isAuth && <li onClick={() => navigate('/transactions')}>Transactions</li>}
            {isAuth && <li onClick={() => navigate('/add-expense')}>Add Expenses</li>}
            {isAuth && <li onClick={() => navigate('/add-income')}>Add Incomes</li>}
            {isAuth && <li onClick={() => navigate('/stats')}>Stats</li>}
            {!isAuth && <li onClick={() => navigate('/login')}>Login</li>}
            {isAuth && <li onClick={handleLogout}>Logout</li>}
        </ul>}
    </div>
  )
}

export default Sidebar;