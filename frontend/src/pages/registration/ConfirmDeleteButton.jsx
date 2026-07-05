import React from 'react'

function ConfirmDeleteButton({ onDelete }) {
    return (
        <button
            className="view-btn"
            style={{ flex: 'none', width: '36px', background: '#fdecea', color: '#dc2626' }}
            title="Delete"
            onClick={onDelete}
        >
            <i className="fas fa-trash"></i>
        </button>
    )
}

export default ConfirmDeleteButton
