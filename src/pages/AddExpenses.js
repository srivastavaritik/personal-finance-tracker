import React, { useEffect, useState } from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const AddExpenses = ({ isAuth }) => {
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseDate, setExpenseDate] = useState(new Date().toJSON().slice(0, 10));
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

    const handleExpense = async (e) => {
        e.preventDefault();
        if (expenseTitle === "" || expenseAmount === "" || expenseDate === "") {
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
        <div className="main-container">
            <main>
                <h2>Add Expense</h2>
                <hr />
                <div className="form-container">
                    <h2>Expenses</h2>
                    <form onSubmit={handleExpense}>
                        <label htmlFor="expenseTitle">Title</label>
                        <input type="text" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
                        <input type="date" className="calendar-input" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
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
            </main>
        </div>
    );
};

export default AddExpenses;

