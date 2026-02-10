import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import './FeedbackButton.css';

const FeedbackButton = ({ pageName, onFeedbackSubmit }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        className="feedback-button"
        onClick={() => setShowModal(true)}
        title="Suggest changes or additions"
      >
        💡 Suggest Changes
      </button>

      {showModal && (
        <FeedbackModal
          pageName={pageName}
          onClose={() => setShowModal(false)}
          onSubmit={onFeedbackSubmit}
        />
      )}
    </>
  );
};

export default FeedbackButton;
