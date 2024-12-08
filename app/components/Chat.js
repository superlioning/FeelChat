// components/Chat.js
"use client";

import { useState, useEffect, Fragment } from "react";
import pusher from "../utils/pusherClient";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import { useGlobalState } from "../context/GlobalStateContext";
import { analyzeMessage } from "../utils/analyzeSentiment";

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

export default function Chat() {
  const { user, channel } = useGlobalState();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState(NEUTRAL_EMOJI);
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
            ? { ...chat, message: data.message, edited: true }
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

    const sentimentResult = analyzeMessage(input);
    const newEmoji =
      sentimentResult.score > 0
        ? HAPPY_EMOJI
        : sentimentResult.score === 0
        ? NEUTRAL_EMOJI
        : SAD_EMOJI;
    setCurrentEmoji(newEmoji);

    await axios.post("/api/messages", {
      username: user,
      message: input,
      channel,
    });

    setInput("");
  };

  const editMessage = async (messageId, newText) => {
    if (!newText.trim()) return;

    await axios.post("/api/messages", {
      messageId,
      message: newText,
      channel,
      action: "edit",
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
                    <span className="d-block" style={{ fontSize: "1.6rem" }}>
                      {String.fromCodePoint(...currentEmoji)}
                    </span>
                    <span>{chat.username || "Anonymous"}</span>
                  </div>
                )}
                <ChatMessage
                  message={chat.message}
                  position={position}
                  isEditing={editingMessageId === chat.messageId}
                  onEdit={(newText) => editMessage(chat.messageId, newText)}
                  editInput={editInput}
                  setEditInput={setEditInput}
                  showActions={showActions}
                  onEditClick={() => {
                    setEditingMessageId(chat.messageId);
                    setEditInput(chat.message);
                  }}
                  onDeleteClick={() => deleteMessage(chat.messageId)}
                  edited={chat.edited}
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
        </div>
      </Fragment>
    )
  );
}
