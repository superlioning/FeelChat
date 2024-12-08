// components/Chat.js
"use client";

import { useState, useEffect, Fragment } from "react";
import pusher from "../utils/pusherClient";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import { useGlobalState } from "../context/GlobalStateContext";
import { analyzeMessage } from "../utils/analyzeSentiment";

const MESSAGE_MODIFY_TIMEOUT = 10000;

export default function Chat() {
  const { user, channel } = useGlobalState();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    const pusherChannel = pusher.subscribe(channel);

    const handleMessage = (data) => {
      setChats((prevChats) => [...prevChats, data]);
    };

    const handleEdit = (data) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.messageId === data.messageId
            ? {
              ...chat,
              sentimentScore: data.sentimentScore,
              message: data.message,
              edited: true
            }
            : chat
        )
      );
    };

    const handleDelete = (data) => {
      setChats((prevChats) =>
        prevChats.filter((chat) => chat.messageId !== data.messageId)
      );
    };

    pusherChannel.bind("new-message", handleMessage);
    pusherChannel.bind("edit-message", handleEdit);
    pusherChannel.bind("delete-message", handleDelete);

    return () => {
      pusherChannel.unbind("new-message", handleMessage);
      pusherChannel.unbind("edit-message", handleEdit);
      pusherChannel.unbind("delete-message", handleDelete);
      pusher.unsubscribe(channel);
    };
  }, [channel]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Analyze sentiment of the message
    const sentimentResult = analyzeMessage(input);

    await axios.post("/api/messages", {
      username: user,
      sentimentScore: sentimentResult.score,
      message: input,
      channel
    });

    setInput("");
  };

  const editMessage = async (messageId, newText) => {
    if (!newText.trim()) return;

    // Re-analyze sentiment of edited message
    const sentimentResult = analyzeMessage(newText);

    await axios.post("/api/messages", {
      messageId,
      sentimentScore: sentimentResult.score,
      message: newText,
      channel,
      action: "edit"
    });

    setEditingMessageId(null);
    setEditInput("");
  };

  const deleteMessage = async (messageId) => {
    await axios.post("/api/messages", {
      messageId,
      channel,
      action: "delete",
    });
  };

  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      sendMessage();
    }
  };

  return (
    user && (
      <Fragment>
        <div
          className="border-bottom border-gray w-100 d-flex align-items-center bg-white"
          style={{ height: 90 }}
        >
          <h2 className="text-dark mb-0 mx-4 px-2 text-3xl font-bold">
            {user}
          </h2>
        </div>

        <div
          className="px-4 pb-4 w-100 d-flex flex-row flex-wrap align-items-start align-content-start position-relative"
          style={{ height: "calc(100% - 180px)", overflowY: "scroll" }}
        >
          {chats.map((chat, index) => {
            const previous = Math.max(0, index - 1);
            const previousChat = chats[previous];
            const position = chat.username === user ? "right" : "left";
            const isFirst = previous === index;
            const inSequence = chat.username === previousChat?.username;
            const hasDelay =
              Math.ceil(
                (chat.timestamp - previousChat?.timestamp) / (1000 * 60)
              ) > 1;
            const isOwner = chat.username === user;
            const isRecent = Date.now() - chat.timestamp < 5000;
            const showActions = isOwner && isRecent;

            return (
              <Fragment key={chat.messageId || index}>
                {(isFirst || !inSequence || hasDelay) && (
                  <div
                    className={`d-block w-100 font-weight-bold text-dark mt-4 pb-1 px-1 text-${position}`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    <span>{chat.username || "Anonymous"}</span>
                  </div>
                )}
                <ChatMessage
                  message={chat.message}
                  sentimentScore={chat.sentimentScore}
                  position={position}
                  isEditing={editingMessageId === chat.messageId}
                  onEdit={(newText) => editMessage(chat.messageId, newText)}
                  editInput={editInput}
                  setEditInput={setEditInput}
                  showActions={isOwner}
                  onEditClick={() => {
                    const timeSinceMessage = Date.now() - chat.timestamp;
                    if (timeSinceMessage <= MESSAGE_MODIFY_TIMEOUT) {
                      setEditingMessageId(chat.messageId);
                      setEditInput(chat.message);
                    }
                  }}
                  onDeleteClick={() => {
                    const timeSinceMessage = Date.now() - chat.timestamp;
                    if (timeSinceMessage <= MESSAGE_MODIFY_TIMEOUT) {
                      deleteMessage(chat.messageId);
                    }
                  }}
                  edited={chat.edited}
                  timestamp={chat.timestamp}
                />
              </Fragment>
            );
          })}
        </div>

        <div
          className="border-top border-gray w-100 px-4 d-flex align-items-center bg-light"
          style={{ minHeight: 90 }}
        >
          <textarea
            className="form-control px-3 py-2"
            onKeyUp={handleKeyUp}
            placeholder="Enter a chat message"
            style={{ resize: "none" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <button
            onClick={sendMessage}
            className="btn btn-primary ml-2"
            style={{ height: "60px" }}
          >
            Send Message
          </button>
        </div>
      </Fragment>
    )
  );
}