import { collection, getDocs, query, where } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import "@carbon/styles/css/styles.css";
import './styles.css'
import '../../pages/Home.css'

import "@carbon/charts/styles.css";
import { LineChart } from "@carbon/charts-react";

import './styles.css'
import { CirclesWithBar } from 'react-loader-spinner';

const GraphChart = () => {

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [mergedData, setMergedData] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state

    const fetchData = async () => {
        try {
            const expenseQuerySnapshot = await getDocs(query(collection(db, 'expense'), where('userId', '==', auth.currentUser.uid)));
            const fetchedExpenses = expenseQuerySnapshot.docs.map((doc) => ({ userId: doc.userId, ...doc.data() }));

            const incomeQuerySnapshot = await getDocs(query(collection(db, 'income'), where('userId', '==', auth.currentUser.uid)));
            const fetchedIncomes = incomeQuerySnapshot.docs.map((doc) => ({ userId: doc.userId, ...doc.data() }));

            setExpenses(fetchedExpenses);
            setIncomes(fetchedIncomes);
        } catch (error) {
            console.log('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false when data fetching is complete
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchData();
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        setMergedData([...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, [expenses, incomes]);

    const state = {
        data: mergedData.map((data) => ({ "group": data.type, "date": data.date, "amount": data.amount })),
        options: {
            "title": "Income vs Expense",
            "axes": {
                "left": {
                    "scaleType": "labels",
                    "title": "Amount (Rs.)",
                    "mapsTo": "amount"
                },
                "bottom": {
                    "scaleType": "time",
                    "title": "Quarters",
                    "mapsTo": "date",
                },

            },
            "curve": "curveNatural",
            "height": "400px",
        }
    };

    return (
        <div className="chartCont">
            {loading ? (
                <div className='loaderCont'>
                    <div className='loader'>
                        <CirclesWithBar
                            height="100"
                            width="100"
                            color="#4fa94d"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            outerCircleColor=""
                            innerCircleColor=""
                            barColor=""
                            ariaLabel='circles-with-bar-loading'
                        />
                    </div>
                </div> // Render a loader component while the chart is loading
            ) : (
                <LineChart
                    data={state.data}
                    options={state.options}
                />
            )}
        </div>
    )
}

export default GraphChart;
