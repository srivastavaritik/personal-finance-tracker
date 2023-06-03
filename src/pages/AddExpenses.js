import React, { useEffect, useState } from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const AddExpenses = ({ isAuth }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toJSON().slice(0, 10));
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
        if (title === "" || amount === "" || date === "") {
            alert("Please fill all the fields");
            return;
        }
        await addDoc(expenseCollectionRef, {
            id: auth.currentUser.uid,
            title: title,
            amount: amount,
            date: date,
            type:"expense",
            time: new Date().getTime()
        })

        console.log("Expense added", [title, amount, date]);
        setTitle("");
        setAmount("");
        setDate("");
    }

    const handleDay = (e) => {
        const value = e.target.value;
        setDay(value);
        if (value !== "other") {
            setDate(new Date().toJSON().slice(0, 10));
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
                        <label htmlFor="title">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="date" className="calendar-input" value={date} onChange={(e) => setDate(e.target.value)} />
                        <label htmlFor="amount">Amount</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <label htmlFor="date">Date</label>
                        <select name="day" id="day" value={day} onChange={handleDay}>
                            <option value={new Date().toJSON().slice(0, 10).replace(/-/g, "/")}>Today</option>
                            <option value="other">Other day</option>
                        </select>
                        {toggleCalendar && <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
                        <button type="submit">Add Expense</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddExpenses;

