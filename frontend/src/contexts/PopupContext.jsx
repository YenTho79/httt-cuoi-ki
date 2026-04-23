import React, { createContext, useContext, useState } from 'react';
import Modal from '../components/Modal';

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showPopup = (options) => {
    setPopup({
      isOpen: true,
      title: options.title || 'Thông báo',
      message: options.message || '',
      type: options.type || 'info',
      onConfirm: options.onConfirm || null,
    });
  };

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      <Modal
        {...popup}
        onClose={closePopup}
        onConfirm={() => {
          if (popup.onConfirm) popup.onConfirm();
          closePopup();
        }}
      />
    </PopupContext.Provider>
  );
}

export const usePopup = () => useContext(PopupContext);
