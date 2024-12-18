import React from 'react';
import './DeleteConfirm.css';

const DeleteConfirmPopup = ({ itemId, onClose, onDelete }) => {
    const handleDelete = () => {
        onDelete(itemId);
        onClose();
    };

    return (
        <div className='delete-confirm-overlay'>
            <div className='delete-confirm-content'>
                <div className='delete-confirm-header'>
                    <i className='fa-solid fa-triangle-exclamation' />
                    <h2>ARE YOU SURE?</h2>
                    <button 
                        className='delete-confirm-close' 
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <div className='delete-confirm-body'>
                    <p>Are you sure you want to delete this?</p>
                    <p>This action cannot be undone!</p>
                </div>
                <div className='delete-confirm-footer'>
                        <button 
                            className='delete-confirm-cancel' 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className='delete-confirm-delete' 
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default DeleteConfirmPopup;