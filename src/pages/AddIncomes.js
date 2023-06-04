import React, { useEffect, useState } from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ProgressBar } from 'react-loader-spinner';

const AddIncomes = ({ isAuth }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toJSON().slice(0, 10));
    const [day, setDay] = useState("");
    const [toggleCalendar, setToggleCalendar] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
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
        if (title === "" || amount === "" || date === "") {
            alert("Please fill all the fields");
            return;
        }
        setLoading(true); // Set loading to true when the form is submitted

        try {
            await addDoc(incomeCollectionRef, {
                id: auth.currentUser.uid,
                title: title,
                amount: amount,
                date: date,
                type: "income",
                time: new Date().getTime()
            });
            console.log("Income added", [title, amount, date]);
            setTitle("");
            setAmount("");
            setDate("");
        } catch (error) {
            console.log("Error adding income:", error);
        } finally {
            setLoading(false); // Set loading to false when the submission is complete
        }
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
                <h2>Add Income</h2>
                <hr />
                <div className="form-container">
                    {loading ? (
                        <div className='loaderCont'>
                        <div className='loader'>
                            <ProgressBar
                                height="80"
                                width="80"
                                ariaLabel="progress-bar-loading"
                                wrapperStyle={{}}
                                wrapperClass="progress-bar-wrapper"
                                borderColor='#F4442E'
                                barColor='#51E5FF'
                            />
                        </div>
                    </div> // Render a loader component while the form is being submitted
                    ) : (
                        <form onSubmit={handleIncomes}>
                            <label htmlFor="title">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <label htmlFor="amount">Amount</label>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            <label htmlFor="date">Date</label>
                            <select name="day" id="day" value={day} onChange={handleDay}>
                                <option value={new Date().toJSON().slice(0, 10).replace(/-/g, "/")}>Today</option>
                                <option value="other">Other day</option>
                            </select>
                            {toggleCalendar && <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
                            <button type="submit">Add Income</button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AddIncomes;
