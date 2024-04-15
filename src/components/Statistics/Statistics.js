import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
  const [initialExpenses, setInitialExpenses] = useState([]);
  const [initialProfits, setInitialProfits] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profits, setProfits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profitCategories, setProfitCategories] = useState([]);
  const [expenseSortOrder, setExpenseSortOrder] = useState('up');
  const [profitSortOrder, setProfitSortOrder] = useState('up'); 
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('');
  const [selectedProfitCategory, setSelectedProfitCategory] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/expenses')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке расходов: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setExpenses(data);
        setInitialExpenses(data);
      })
      .catch(error => console.error('Ошибка при загрузке расходов:', error));

    fetch('http://localhost:3000/profits')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке доходов: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setProfits(data);
        setInitialProfits(data);
      })
      .catch(error => console.error('Ошибка при загрузке доходов:', error));

    fetch('http://localhost:3000/category')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке категорий: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error('Ошибка при загрузке категорий:', error));

    fetch('http://localhost:3000/profit-category')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке категорий доходов: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setProfitCategories(data);
      })
      .catch(error => console.error('Ошибка при загрузке категорий доходов:', error));
  }, []);

  const getCategoryNameById = (categoryId, type) => {
    const allItems = type === 'expenses' ? expenses : profits;
    const category = type === 'expenses' ? categories.find(cat => cat.id === categoryId) : profitCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
  };

  const handleDeleteExpense = (id) => {
    fetch(`http://localhost:3000/expenses/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении расхода: ' + response.status);
        }
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      })
      .catch(error => console.error('Ошибка при удалении расхода:', error));
  };

  const handleDeleteProfit = (id) => {
    fetch(`http://localhost:3000/profits/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении дохода: ' + response.status);
        }
        setProfits(prevProfits => prevProfits.filter(profit => profit.id !== id));
      })
      .catch(error => console.error('Ошибка при удалении дохода:', error));
  };

  const calculateTotalExpense = () => {
    return expenses.reduce((total, expense) => total + expense.price, 0).toLocaleString('ru');
  };

  const calculateTotalProfit = () => {
    return profits.reduce((total, profit) => total + profit.price, 0).toLocaleString('ru');
  };

  const sortExpenses = (order) => {
    const sortedExpenses = [...expenses].sort((a, b) => {
      if (order === 'up') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setExpenses(sortedExpenses);
    setExpenseSortOrder(order);
  };

  const sortProfits = (order) => {
    const sortedProfits = [...profits].sort((a, b) => {
      if (order === 'up') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setProfits(sortedProfits);
    setProfitSortOrder(order);
  };

  const filterExpensesByCategory = () => {
    let filteredExpenses = [...initialExpenses];
    if (selectedExpenseCategory) {
      filteredExpenses = filteredExpenses.filter(expense => expense.categoryId === selectedExpenseCategory);
    }
    setExpenses(filteredExpenses);
  };

  const filterProfitsByCategory = () => {
    let filteredProfits = [...initialProfits];
    if (selectedProfitCategory) {
      filteredProfits = filteredProfits.filter(profit => profit.categoryId === selectedProfitCategory);
    }
    setProfits(filteredProfits);
  };

  return (
    <div>
      <h2>Статистика расходов</h2>
      <p>Общая сумма расходов: {calculateTotalExpense()}</p>
      <div className='sort-buttons'>
        <button onClick={() => sortExpenses('up')}>По возрастанию &uarr;</button>
        <button onClick={() => sortExpenses('down')}>По убыванию &darr;</button>
      </div>
      <div>
        <select value={selectedExpenseCategory} onChange={(e) => setSelectedExpenseCategory(e.target.value)}>
          <option value="">Все категории</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={() => filterExpensesByCategory()}>Фильтровать</button>
      </div>
      <div className="card-container">
        {expenses.map(expense => (
          <div key={expense.id} className="card expense-card">
            <div>Сумма: {expense.price}</div>
            <div>Категория: {getCategoryNameById(expense.categoryId, 'expenses')}</div>
            <div>Комментарий: {expense.comment}</div>
            <button onClick={() => handleDeleteExpense(expense.id)}>Удалить</button>
          </div>
        ))}
      </div>
      <h2>Статистика доходов</h2>
      <p>Общая сумма доходов: {calculateTotalProfit()}</p>
      <div className='sort-buttons'>
        <button onClick={() => sortProfits('up')}>По возрастанию &uarr;</button>
        <button onClick={() => sortProfits('down')}>По убыванию &darr;</button>
      </div>
      <div>
        <select value={selectedProfitCategory} onChange={(e) => setSelectedProfitCategory(e.target.value)}>
          <option value="">Все категории</option>
          {profitCategories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={() => filterProfitsByCategory()}>Фильтровать</button>
      </div>
      <div className="card-container">
        {profits.map(profit => (
          <div key={profit.id} className="card profit-card">
            <div>Сумма: {profit.price}</div>
            <div>Категория: {getCategoryNameById(profit.categoryId, 'profits')}</div>
            <div>Комментарий: {profit.comment}</div>
            <button onClick={() => handleDeleteProfit(profit.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
