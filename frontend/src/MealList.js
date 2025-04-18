// Örneğin MealList.js veya bir benzeri dosyada:
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import UpdateMeal from './UpdateMeal';

function MealCard({ meal }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleUpdateSuccess = () => {
    // Burada parent state'inizi güncelleyin veya listeyi yeniden çekin
    setShowUpdateModal(false);
  };

  return (
    <div className="meal-card">
      <h4>{meal.name}</h4>
      <button onClick={() => setShowUpdateModal(true)}>Güncelle</button>

      {showUpdateModal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UpdateMeal 
              mealId={meal.id} 
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={() => setShowUpdateModal(false)}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default MealCard;
