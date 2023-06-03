import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import { useState } from 'react';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login setIsAuth={setIsAuth}/>} />
        <Route path='/home' element={<Home isAuth={isAuth}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
