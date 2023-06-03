import React, { useEffect, useState } from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';

const Home = ({ isAuth }) => {
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseDate, setExpenseDate] = useState(new Date().toJSON().slice(0, 10));
    const [incomeTitle, setIncomeTitle] = useState();
    const [incomeAmount, setIncomeAmount] = useState("");
    const [incomeDate, setIncomeDate] = useState(new Date().toJSON().slice(0, 10));
    const [day, setDay] = useState("");
    const [toggleCalendar, setToggleCalendar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            // redirect to login
            navigate('/login');
        }
    }, [isAuth, navigate]);

    const expenseCollectionRef = collection(db, "expense");
    const incomeCollectionRef = collection(db, "income");

    const handleExpense = async (e) => {
        e.preventDefault();
        if(expenseTitle === "" || expenseAmount === "" || expenseDate === "") {
            alert("Please fill all the fields");
            return;
        }
        await addDoc(expenseCollectionRef, {
            id: auth.currentUser.uid,
            title: expenseTitle, 
            amount: expenseAmount, 
            date: expenseDate,
        })

        console.log("Expense added", [expenseTitle, expenseAmount, expenseDate]);
        setExpenseTitle("");
        setExpenseAmount("");
        setExpenseDate("");
    }
    const handleIncomes = async (e) => {
        e.preventDefault();
        if(incomeTitle === "" || incomeAmount === "" || incomeDate === "") {
            alert("Please fill all the fields");
            return;
        }
        await addDoc(incomeCollectionRef, {
            id: auth.currentUser.uid,
            title: incomeTitle,
            amount: incomeAmount,
            date: incomeDate,
        })

        console.log("Income added", [incomeTitle, incomeAmount, incomeDate]);
        setIncomeTitle("");
        setIncomeAmount("");
        setIncomeDate("");
    }

    const handleLogout = () => {
        // Handle logout logic here
        auth.signOut();
        localStorage.setItem("isAuth", false);
        navigate('/login');
    };

    const handleDay = (e) => {
        const value = e.target.value;
        setDay(value);
        if (value !== "other") {
            setExpenseDate(new Date().toJSON().slice(0, 10));
            setToggleCalendar(false)
        }
        else {
            setToggleCalendar(true);
        }
    }

    return (
        <div>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            </nav>
            <main>
                <h1>Expense Tracker</h1>
                <h2>Hi {auth.currentUser && auth.currentUser.displayName}</h2>
                <div>
                    <h2>Expenses</h2>
                    <form onSubmit={handleExpense}>
                        <label htmlFor="expenseTitle">Title</label>
                        <input type="text" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
                        <label htmlFor="expenseAmount">Amount</label>
                        <input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
                        <label htmlFor="expenseDate">Date</label>
                        <select name="day" id="day" value={day} onChange={handleDay}>
                            <option value={new Date().toJSON().slice(0, 10).replace(/-/g, "/")}>Today</option>
                            <option value="other">Other day</option>
                        </select>
                        {toggleCalendar && <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />}
                        <button type="submit">Add Expense</button>
                    </form>
                </div>
                <div>
                    <h2>Incomes</h2>
                    <form onSubmit={handleIncomes}>
                        <label htmlFor="incomeTitle">Title</label>
                        <input type="text" value={incomeTitle} onChange={(e) => setIncomeTitle(e.target.value)} />
                        <label htmlFor="incomeAmount">Amount</label>
                        <input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} />
                        <label htmlFor="incomeDate">Date</label>
                        <select name="day" id="day" value={day} onChange={handleDay}>
                            <option value={new Date().toJSON().slice(0, 10).replace(/-/g, "/")}>Today</option>
                            <option value="other">Other day</option>
                        </select>
                        {toggleCalendar && <input type="date" value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} />}
                        <button type="submit">Add Income</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Home;
