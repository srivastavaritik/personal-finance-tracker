import { collection, getDocs, query, where } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import './Transactions.css';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Transactions = ({isAuth}) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();
useEffect(() => {
  if(!isAuth){
    navigate('/login')
  }
}, [isAuth, navigate])
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

  return (
    <div className="container">
      <h1>Expenses and Incomes</h1>
      {loading ? (
        <div className='loaderCont'>
          <div className='loader'>
          <ColorRing
            visible={true}
            height="120"
            width="120"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
            </div>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.length === 0 ? (
              <tr>
                <td colSpan="3">No data found</td>
              </tr>
            ) : (
              mergedData.map((item, index) => (
                <tr key={index} className={item.type === 'expense' ? 'expense-row' : 'income-row'}>
                  <td>{item.title}</td>
                  <td>{item.amount}</td>
                  <td>{item.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
