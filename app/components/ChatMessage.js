// components/ChatMessage.js
"use client";

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
}) => {
  const isRight = position.toLowerCase() === "right";
  const align = isRight ? "text-right" : "text-left";
  const justify = isRight ? "justify-content-end" : "justify-content-start";

  const messageBoxStyles = {
    maxWidth: "70%",
    flexGrow: 0,
    position: "relative",
  };

  const messageStyles = {
    fontWeight: 500,
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
  };

  const actionButtonStyles = {
    position: "absolute",
    top: "-20px",
    right: "0",
    display: "flex",
    gap: "8px",
  };

  return (
    <div className={`w-100 my-1 d-flex ${justify}`}>
      <div
        className="bg-light rounded border border-gray p-2"
        style={messageBoxStyles}
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
              {edited && <small className="text-muted ml-2">(edited)</small>}
            </span>
            {showActions && (
              <div style={actionButtonStyles}>
                <button
                  onClick={onEditClick}
                  className="btn btn-sm btn-link p-0"
                >
                  Edit
                </button>
                <button
                  onClick={onDeleteClick}
                  className="btn btn-sm btn-link text-danger p-0"
                >
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
