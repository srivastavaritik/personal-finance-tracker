import './App.css';
import Login from './pages/Login';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import AddExpenses from './pages/AddExpenses';
import AddIncomes from './pages/AddIncomes';
import Transactions from './pages/Transactions';
import LineChart from './components/Charts/GraphChart';
import GraphChart from './components/Charts/GraphChart';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <BrowserRouter>
      <div className='App'>
        <Sidebar isAuth={isAuth} setIsAuth={setIsAuth} />
        <Routes>
          <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
          {isAuth && <Route path='/add-expense' element={<AddExpenses isAuth={isAuth} />} />}
          {isAuth && <Route path='/add-income' element={<AddIncomes isAuth={isAuth} />} />}
          {isAuth && <Route path='/transactions' element={<Transactions isAuth={isAuth} />} />}
          {isAuth && <Route path='/' element={<Transactions isAuth={isAuth} />} />}
          {!isAuth && <Route path='/' element={<Login isAuth={isAuth} />} />}
          {isAuth && <Route path='/stats'element={<GraphChart isAuth={isAuth} />} />}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
