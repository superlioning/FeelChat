'use client';

import { useState, useEffect, Fragment } from 'react';
import pusher from '../utils/pusherClient';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import { useGlobalState } from '../context/GlobalStateContext';
import { analyzeMessage } from '../utils/analyzeSentiment';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

export default function Chat() {
  // Access global state for user and channel
  const { user, channel } = useGlobalState();

  // State to hold chat messages
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');
  const [currentEmoji, setCurrentEmoji] = useState(NEUTRAL_EMOJI);

  useEffect(() => {
    // Set up Pusher for real-time communication
    const pusherChannel = pusher.subscribe(channel);

    // Bind event for receiving new messages
    const handleMessage = (data) => {
      setChats((prevChats) => [...prevChats, data]);
    };

    pusherChannel.bind('new-message', handleMessage);

    // Cleanup function to clear the chat history and disconnect from Pusher
    return () => {
      pusherChannel.unbind('new-message', handleMessage);
      pusher.unsubscribe(channel);
    };
  }, [channel]);

  const sendMessage = async () => {
    const sentimentResult = analyzeMessage(input);
    const newMessage = {
      username: user,
      message: input,
      timestamp: Date.now(),
      sentimentScore: sentimentResult.score,
      channel,
    };

    // Update the current emoji based on the sentiment score
    const newEmoji =
      sentimentResult.score > 0
        ? HAPPY_EMOJI
        : sentimentResult.score === 0
          ? NEUTRAL_EMOJI
          : SAD_EMOJI;
    setCurrentEmoji(newEmoji);

    await axios.post('/api/messages', newMessage);
    setInput('');
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
          <h2 className="text-dark mb-0 mx-4 px-2 text-3xl font-bold">{user}</h2>
        </div>

        <div
          className="px-4 pb-4 w-100 d-flex flex-row flex-wrap align-items-start align-content-start position-relative"
          style={{ height: 'calc(100% - 180px)', overflowY: 'scroll' }}
        >
          {chats.map((chat, index) => {
            // Determine message position and properties for display
            const previous = Math.max(0, index - 1);
            const previousChat = chats[previous];
            const position = chat.username === user ? 'right' : 'left';

            // Check if this is the first message
            const isFirst = previous === index;

            // Check if the user is the same as the previous message
            const inSequence = chat.username === previousChat?.username;

            // Check for a delay between messages
            const hasDelay =
              Math.ceil((chat.timestamp - previousChat?.timestamp) / (1000 * 60)) > 1;

            return (
              <Fragment key={index}>
                {(isFirst || !inSequence || hasDelay) && (
                  <div
                    className={`d-block w-100 font-weight-bold text-dark mt-4 pb-1 px-1 text-${position}`}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span className="d-block" style={{ fontSize: '1.6rem' }}>
                      {String.fromCodePoint(...currentEmoji)}
                    </span>
                    <span>{chat.username || 'Anonymous'}</span>
                  </div>
                )}
                <ChatMessage message={chat.message} position={position} />
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
            style={{ resize: 'none' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
      </Fragment>
    )
  );
}