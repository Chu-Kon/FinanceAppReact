import React from 'react';

const AddCategoryButton = ({ onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <h3>Добавить категорию +</h3>
    </div>
  );
};

export default AddCategoryButton;
