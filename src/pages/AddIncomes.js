import React, { useEffect, useState } from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const AddIncomes = ({ isAuth }) => {
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

    const incomeCollectionRef = collection(db, "income");

    const handleIncomes = async (e) => {
        e.preventDefault();
        if (incomeTitle === "" || incomeAmount === "" || incomeDate === "") {
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

    const handleDay = (e) => {
        const value = e.target.value;
        setDay(value);
        if (value !== "other") {
            setIncomeDate(new Date().toJSON().slice(0, 10));
            setToggleCalendar(false)
        }
        else {
            setToggleCalendar(true);
        }
    }

    return (
        <div className="main-container">
            <main>
                <h2>Add Income</h2>
                <hr />
                <div className="form-container">
                    <h2>Incomes</h2>
                    <form onSubmit={handleIncomes}>
                        <label htmlFor="incomeTitle">Title</label>
                        <input type="text" value={incomeTitle} onChange={(e) => setIncomeTitle(e.target.value)} />
                        <label htmlFor="incomeAmount">Amount</label>
                        <input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} />
                        <label htmlFor="incomeDate">Date</label>
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

export default AddIncomes;

