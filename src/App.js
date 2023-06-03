import './App.css';
import Login from './pages/Login';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import AddExpenses from './pages/AddExpenses';
import AddIncomes from './pages/AddIncomes';
import Transactions from './pages/Transactions';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <BrowserRouter>
      <div className='App'>
        <Sidebar isAuth={isAuth} setIsAuth={setIsAuth} />
        <Routes>
          <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
          <Route path='/home' element={<Home isAuth={isAuth} />} />
          <Route path='/add-expense' element={<AddExpenses isAuth={isAuth} />} />
          <Route path='/add-income' element={<AddIncomes isAuth={isAuth} />} />
          <Route path='/transactions' element={<Transactions isAuth={isAuth} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
