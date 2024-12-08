// components/ChatMessage.js
"use client";
import { useState, useEffect } from "react";

const MODIFY_TIMEOUT = 10000; // 10 seconds

const ChatMessage = ({
  message,
  position = "left",
  isEditing,
  onEdit,
  editInput,
  setEditInput,
  showActions,
  onEditClick,
  onDeleteClick,
  edited,
  timestamp,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [canModify, setCanModify] = useState(true);
  const isRight = position.toLowerCase() === "right";
  const align = isRight ? "text-right" : "text-left";
  const justify = isRight ? "justify-content-end" : "justify-content-start";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCanModify(false);
    }, MODIFY_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [timestamp]);

  const messageBoxStyles = {
    maxWidth: "70%",
    flexGrow: 0,
    position: "relative",
    transition: "background-color 0.2s ease",
  };

  const messageStyles = {
    fontWeight: 500,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  };

  const actionButtonStyles = {
    position: "absolute",
    top: "-28px",
    right: "0",
    display: "flex",
    gap: "6px",
    opacity: isHovered && canModify && showActions ? 1 : 0,
    transition: "all 0.2s ease",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "4px 8px",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 1,
    transform:
      isHovered && canModify && showActions
        ? "translateY(0)"
        : "translateY(5px)",
  };

  const buttonBaseStyles = {
    padding: "4px 10px",
    fontSize: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const editButtonStyles = {
    ...buttonBaseStyles,
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    "&:hover": {
      backgroundColor: "#bbdefb",
      transform: "translateY(-1px)",
    },
  };

  const deleteButtonStyles = {
    ...buttonBaseStyles,
    backgroundColor: "#ffebee",
    color: "#d32f2f",
    "&:hover": {
      backgroundColor: "#ffcdd2",
      transform: "translateY(-1px)",
    },
  };

  return (
    <div className={`w-100 my-1 d-flex ${justify}`}>
      <div
        className="bg-light rounded border border-gray p-2"
        style={messageBoxStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          <div className="d-flex">
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="form-control"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onEdit(editInput);
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <div className={align}>
            <span className="d-block text-secondary" style={messageStyles}>
              {message}
              {edited && (
                <small className="text-muted ml-2" style={{ fontSize: "11px" }}>
                  (edited)
                </small>
              )}
            </span>
            {showActions && canModify && (
              <div style={actionButtonStyles}>
                <button
                  onClick={onEditClick}
                  style={editButtonStyles}
                  title="Edit message"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={onDeleteClick}
                  style={deleteButtonStyles}
                  title="Delete message"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
