import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import AddCategoryButton from '../AddCategoryButton/AddCategoryButton';
import AddCategoryModal from '../AddCategoryModal/AddCategoryModal';

const Profits = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalData, setModalData] = useState({
    isOpen: false,
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    comment: ''
  });
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/profit-category')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке категорий: ' + response.status);
        }
        return response.json();
      })
      .then(data => setCategories(data))
      .catch(error => console.error('Ошибка при загрузке категорий:', error));
  }, []);

  const handleModalOpen = (category) => {
    setSelectedCategory(category);
    setModalData(prevState => ({
      ...prevState,
      isOpen: true
    }));
  };

  const handleModalClose = () => {
    setModalData(prevState => ({
      ...prevState,
      isOpen: false
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddCategory = (categoryName, imageUrl) => {
    fetch('http://localhost:3000/profit-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: categoryName,
        imgUrl: imageUrl
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при добавлении категории');
      }
      return response.json();
    })
    .then(newCategory => {
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setIsAddCategoryModalOpen(false);
    })
    .catch(error => console.error('Ошибка при добавлении категории:', error));
  };

  const handleAddProfit = () => {
    fetch('http://localhost:3000/profits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price: parseInt(modalData.amount),
        categoryId: selectedCategory.id,
        comment: modalData.comment
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при добавлении дохода');
        }
        handleModalClose();
      })
      .catch(error => console.error('Ошибка при добавлении дохода:', error));
  };

  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:3000/profit-category/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении категории: ' + response.status);
        }
        setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      })
      .catch(error => console.error('Ошибка при удалении категории:', error));
  };

  return (
    <div>
      <h1>Доходы</h1>
      <p>Выберите категорию:</p>
      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id} className="category-card" onClick={() => handleModalOpen(category)}>
            <h3>{category.name}</h3>
            <img src={category.imgUrl} alt={category.name} />
            <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}>Удалить</button>
          </li>
        ))}
        <li className="add-category-button">
          <AddCategoryButton onClick={() => setIsAddCategoryModalOpen(true)} />
        </li>
      </ul>

      {modalData.isOpen && (
        <Modal onClose={handleModalClose}>
          <h2>{selectedCategory.name}</h2>
          <form onSubmit={handleAddProfit}>
            <label>
              Сумма:
              <input
                type="number"
                name="amount"
                value={modalData.amount}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Дата:
              <input
                type="date"
                name="date"
                value={modalData.date}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Комментарий:
              <input
                type="text"
                name="comment"
                value={modalData.comment}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Добавить доход</button>
          </form>
        </Modal>
      )}

      {isAddCategoryModalOpen && (
        <AddCategoryModal onClose={() => setIsAddCategoryModalOpen(false)} onAddCategory={handleAddCategory} />
      )}
    </div>
  );
};

export default Profits;
