import { collection, getDocs, query, where } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase'; 
import "@carbon/styles/css/styles.css";

import "@carbon/charts/styles.css";
import { LineChart } from "@carbon/charts-react";

import './styles.css'

const GraphChart = () => {

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [mergedData, setMergedData] = useState([]);


    const fetchData = async () => {
        try {
            const expenseQuerySnapshot = await getDocs(query(collection(db, 'expense'), where('id', '==', auth.currentUser.uid)));
            const fetchedExpenses = expenseQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            const incomeQuerySnapshot = await getDocs(query(collection(db, 'income'), where('id', '==', auth.currentUser.uid)));
            const fetchedIncomes = incomeQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            setExpenses(fetchedExpenses);
            setIncomes(fetchedIncomes);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    console.log(expenses, incomes)
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
        data: mergedData.map((data) => ({"group":data.type, "date":data.date, "amount":data.amount})),
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
                    "mapsTo": "date",
                    "title": "Quarters"
                },

            },
            "curve": "curveNatural",
            "height": "400px"
        }
    };  

  return (
      <LineChart
            data={state.data}
            options={state.options}>
        </LineChart>
  )
}

export default GraphChart

// class GraphChart extends React.Component {

    

//     state = {
//         data: [
//             {
//                 "group": "Temperature",
//                 "date": "2018-12-31T18:30:00.000Z",
//                 "temp": 23
//             },
//             {
//                 "group": "Temperature",
//                 "date": "2019-01-31T18:30:00.000Z",
//                 "temp": 15
//             },
//             {
//                 "group": "Temperature",
//                 "date": "2019-02-28T18:30:00.000Z",
//                 "temp": 24
//             },
//             {
//                 "group": "Temperature",
//                 "date": "2019-03-31T18:30:00.000Z",
//                 "temp": 33
//             },
//             {
//                 "group": "Temperature",
//                 "date": "2019-04-30T18:30:00.000Z",
//                 "temp": 23
//             },
//             {
//                 "group": "Temperature",
//                 "date": "2019-05-31T18:30:00.000Z",
//                 "temp": 32
//             },
//             {
//                 "group": "Temperature",
//                 "date": "2019-06-30T18:30:00.000Z",
//                 "temp": 23
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2018-12-31T18:30:00.000Z",
//                 "rainfall": 50
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2019-01-31T18:30:00.000Z",
//                 "rainfall": 65
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2019-02-28T18:30:00.000Z",
//                 "rainfall": 35
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2019-03-31T18:30:00.000Z",
//                 "rainfall": 43
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2019-04-30T18:30:00.000Z",
//                 "rainfall": 53
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2019-05-31T18:30:00.000Z",
//                 "rainfall": 19
//             },
//             {
//                 "group": "Rainfall",
//                 "date": "2019-06-30T18:30:00.000Z",
//                 "rainfall": 13
//             }
//         ],
//         options: {
//             "title": "Line + Line (dual axes)",
//             "axes": {
//                 "left": {
//                     "title": "Temperature (°C)",
//                     "mapsTo": "temp"
//                 },
//                 "bottom": {
//                     "scaleType": "time",
//                     "mapsTo": "date",
//                     "title": "Date"
//                 },
//                 "right": {
//                     "title": "Rainfall (mm)",
//                     "mapsTo": "rainfall",
//                     "correspondingDatasets": [
//                         "Rainfall"
//                     ]
//                 }
//             },
//             "curve": "curveMonotoneX",
//             "height": "400px"
//         }
//     };

//     render = () => (
//         <LineChart
//             data={this.state.data}
//             options={this.state.options}>
//         </LineChart>
//     );
// }

// export default GraphChart;