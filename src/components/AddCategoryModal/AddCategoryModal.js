import React, { useState } from 'react';
import Modal from '../Modal/Modal';


const AddCategoryModal = ({ onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleAddCategory = () => {
    if (categoryName.trim() !== '') {
      onAddCategory(categoryName.trim());
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Добавить категорию</h2>
      <label>
        Название категории:
        <input
          type="text"
          name="categoryName"
          value={categoryName}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleAddCategory}>Добавить</button>
    </Modal>
  );
};

export default AddCategoryModal;

