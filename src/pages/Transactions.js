import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import './Transactions.css';
import { ColorRing, FallingLines, Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Transactions = ({ isAuth }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(500);
  const [totalIncomes, setTotalIncomes] = useState(789);
  const [mergedData, setMergedData] = useState([]);
  const [balanceAmount, setBalanceAmount] = useState();
  const [loading, setLoading] = useState(true);
  const [deletingTransactions, setDeletingTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [updatingTransaction, setUpdatingTransaction] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  const fetchData = async () => {
    try {
      const expenseQuerySnapshot = await getDocs(
        query(collection(db, 'expense'), where('userId', '==', auth.currentUser.uid))
      );
      const fetchedExpenses = expenseQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.userId,
        ...doc.data(),
      }));

      const incomeQuerySnapshot = await getDocs(
        query(collection(db, 'income'), where('userId', '==', auth.currentUser.uid))
      );
      const fetchedIncomes = incomeQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.userId,
        ...doc.data(),
      }));

      setExpenses(fetchedExpenses);
      console.log(fetchedExpenses);
      setIncomes(fetchedIncomes);
      console.log(fetchedIncomes);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
        let tE=0;
        let tI=0;
        expenses.map((expense) => (tE+=Number(expense.amount)));
        incomes.map((incomes) => tI+=Number(incomes.amount));
        console.log(Number(tE), Number(tI));
        setTotalExpenses(tE);
        setTotalIncomes(tI);
        setBalanceAmount(tI-tE);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMergedData([...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [expenses, incomes]);

  const handleDelete = (type, id) => async () => {
    try {
      setDeletingTransactions((prevState) => [...prevState, id]);
      await deleteDoc(doc(db, type, id));
      await fetchData();
      console.log(`${type} deleted`);
    } catch (error) {
      console.log(`Error deleting ${type}:`, error);
    } finally {
      setDeletingTransactions((prevState) => prevState.filter((transactionId) => transactionId !== id));
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setUpdatingTransaction(true);
      await updateDoc(doc(db, editingTransaction.type, editingTransaction.id), editingTransaction);
      await fetchData();
      console.log('Transaction updated');
      setEditingTransaction(null);
      setModalIsOpen(false);
    } catch (error) {
      console.log('Error updating transaction:', error);
    } finally {
      setUpdatingTransaction(false);
    }
  };

  return (
    <div className="container">
      <h1>Expenses and Incomes</h1>
      {loading ? (
        <div className="loaderCont">
          <div className="loader">
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
      ) : (<>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.length === 0 ? (
              <tr>
                <td colSpan="4">No data found</td>
              </tr>
            ) : (
              mergedData.map((item) => (
                <tr
                  key={item.id}
                  className={item.type === 'expense' ? 'expense-row' : 'income-row'}
                >
                  <td>{item.title}</td>
                  <td>{item.amount}</td>
                  <td>{item.date}</td>
                  <td>
                    {deletingTransactions.includes(item.id) ? (
                      <div className="loader">
                        <FallingLines
                          color="#4fa94d"
                          height="20"
                          width="20"
                          visible={true}
                          ariaLabel="falling-lines-loading"
                        />
                      </div>
                    ) : (
                      <>
                        <button className="del-btn" onClick={handleDelete(item.type, item.id)}>
                          Delete
                        </button>
                        <button className="edit-btn" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          <div>
            <div>Total Expense: {totalExpenses}</div>
            <div>Total Incomes: {totalIncomes}</div>
            <div>Balance Amount: {balanceAmount}</div>
          </div>
        </>
      )}

      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Transaction</h2>
            <label>
              Title:
              <input
                type="text"
                value={editingTransaction.title}
                onChange={(e) =>
                  setEditingTransaction((prevState) => ({
                    ...prevState,
                    title: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Amount:
              <input
                type="text"
                value={editingTransaction.amount}
                onChange={(e) =>
                  setEditingTransaction((prevState) => ({
                    ...prevState,
                    amount: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={editingTransaction.date}
                onChange={(e) =>
                  setEditingTransaction((prevState) => ({
                    ...prevState,
                    date: e.target.value,
                  }))
                }
              />
            </label>
            <button
            style={{backgroundColor: '#4fa94d', color: 'white'}}
              className="submit-btn"
              disabled={updatingTransaction}
              onClick={handleSubmit}
            >
              {updatingTransaction ? <Oval
                height={15}
                width={15}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}

              /> : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
