import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatMessage from './ChatMessage';
import { useGlobalState } from '../context/GlobalStateContext';


/**
 * @returns - A chat component for real-time communication
 */


// Define emoji codes for different moods
const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

const Chat = () => {
  // Access global state for user and channel
  const { user, channel } = useGlobalState();

  // State to hold chat messages
  const [chats, setChats] = useState([]);

  const [editingMessage, setEditingMessage] = useState(null);

  // Edit handler
  const handleEdit = (messageId, currentMessage) => {
    setEditingMessage({ id: messageId, text: currentMessage });
  };

  // Save edit handler
  const handleSaveEdit = async (messageId, newMessage) => {
    try {
      await axios.post("/edit-message", {
        messageId,
        newMessage,
        timestamp: +new Date(),
        channel,
        user,
      });
      setEditingMessage(null);
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  useEffect(() => {
    // Set up Pusher for real-time communication
    const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    // Subscribe to the channel
    const pusherChannel = pusher.subscribe(channel);

    // Bind event for receiving new messages
    pusherChannel.bind("new-message", ({ chat = null }) => {
      chat && setChats((prevChats) => [...prevChats, chat]);
    });

    // Fetch existing messages when connected
    pusher.connection.bind("connected", () => {
      axios.post("/messages").then((response) => {
        const fetchedChats = response.data.messages;
        setChats(fetchedChats);
      });
    });

    pusherChannel.bind(
      "message-edited",
      ({ messageId, newMessage, editedAt }) => {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.timestamp === messageId
              ? { ...chat, message: newMessage, edited: true, editedAt }
              : chat
          )
        );
      }
    );

    // Cleanup function to clear the chat history and disconnect from Pusher
    return () => {
      axios.post("/leave-room");
      pusher.disconnect();
    };
  }, [channel]);

  const handleKeyUp = (evt) => {
    // Get the value of the input field
    const value = evt.target.value;

    // Check if the Enter key is pressed without Shift
    if (evt.keyCode === 13 && !evt.shiftKey) {
      const chat = {
        user,
        message: value,
        timestamp: +new Date(),
        channel: channel,
      };

      // Clear the input field and send the message to the server
      evt.target.value = "";
      axios.post("/message", chat);
    }
  };

  return (
    user && (
      <Fragment>
        <div
          className="border-bottom border-gray w-100 d-flex align-items-center bg-white"
          style={{ height: 90 }}
        >
          <h2 className="text-dark mb-0 mx-4 px-2">{user}</h2>
        </div>

        <div
          className="px-4 pb-4 w-100 d-flex flex-row flex-wrap align-items-start align-content-start position-relative"
          style={{ height: "calc(100% - 180px)", overflowY: "scroll" }}
        >
          {chats.map((chat, index) => {
            // Determine message position and properties for display
            const previous = Math.max(0, index - 1);
            const previousChat = chats[previous];
            const position = chat.user === user ? "right" : "left";

            // Check if this is the first message
            const isFirst = previous === index;

            // Check if the user is the same as the previous message
            const inSequence = chat.user === previousChat?.user;

            // Check for a delay between messages
            const hasDelay =
              Math.ceil(
                (chat.timestamp - previousChat?.timestamp) / (1000 * 60)
              ) > 1;

            // Determine mood emoji based on sentiment
            const mood =
              chat.sentiment > 0
                ? HAPPY_EMOJI
                : chat.sentiment === 0
                ? NEUTRAL_EMOJI
                : SAD_EMOJI;

            return (
              <Fragment key={index}>
                {(isFirst || !inSequence || hasDelay) && (
                  <div
                    className={`d-block w-100 font-weight-bold text-dark mt-4 pb-1 px-1 text-${position}`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    <span className="d-block" style={{ fontSize: "1.6rem" }}>
                      {String.fromCodePoint(...mood)}
                    </span>
                    <span>{chat.user || "Anonymous"}</span>
                  </div>
                )}
                <ChatMessage
                  message={chat.message}
                  position={position}
                  isEdited={chat.edited}
                  editedAt={chat.editedAt}
                  canEdit={chat.user === user && !editingMessage}
                  isEditing={editingMessage?.id === chat.timestamp}
                  onEditClick={() => handleEdit(chat.timestamp, chat.message)}
                  onSaveEdit={(newMessage) =>
                    handleSaveEdit(chat.timestamp, newMessage)
                  }
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
          ></textarea>
        </div>
      </Fragment>
    )
  );
};

export default Chat;