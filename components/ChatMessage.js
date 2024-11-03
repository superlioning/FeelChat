import React, { useState } from "react";

const ChatMessage = ({
  message,
  position = "left",
  isEdited,
  editedAt,
  canEdit,
  isEditing,
  onEditClick,
  onSaveEdit,
}) => {
  const [editText, setEditText] = useState(message);
  const [showEditButton, setShowEditButton] = useState(false);

  const isRight = position.toLowerCase() === "right";
  const align = isRight ? "text-right" : "text-left";
  const justify = isRight ? "justify-content-end" : "justify-content-start";

  const messageBoxStyles = {
    maxWidth: "70%",
    flexGrow: 0,
    position: "relative", // Added for edit button positioning
  };

  const messageStyles = {
    fontWeight: 500,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  };

  const editButtonStyles = {
    position: "absolute",
    right: isRight ? "auto" : "0",
    left: isRight ? "0" : "auto",
    top: "0",
    opacity: showEditButton ? "1" : "0",
    transition: "opacity 0.2s ease-in-out",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "none",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "12px",
    color: "#007bff",
  };

  return (
    <div className={`w-100 my-1 d-flex ${justify}`}>
      <div
        className="bg-light rounded border border-gray p-2"
        style={messageBoxStyles}
        onMouseEnter={() => canEdit && setShowEditButton(true)}
        onMouseLeave={() => setShowEditButton(false)}
      >
        {isEditing ? (
          <div className={align}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="form-control mb-2"
              style={messageStyles}
              autoFocus
            />
            <div className="btn-group">
              <button
                className="btn btn-sm btn-primary mr-2"
                onClick={() => onSaveEdit(editText)}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onEditClick(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={align}>
            <span className="d-block text-secondary" style={messageStyles}>
              {message}
              {isEdited && (
                <small className="text-muted ml-2">
                  (edited {new Date(editedAt).toLocaleTimeString()})
                </small>
              )}
            </span>
            {canEdit && (
              <button
                style={editButtonStyles}
                onClick={onEditClick}
                className="edit-button"
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;