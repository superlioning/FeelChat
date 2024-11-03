// app/components/Chat.js
import { useState, useEffect } from 'react';
import pusher from '../utils/pusherClient';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const channel = pusher.subscribe('chat-channel');
    const handleMessage = (data) => setMessages((prev) => [...prev, data]);

    channel.bind('new-message', handleMessage);

    return () => {
      channel.unbind('new-message', handleMessage);
      pusher.unsubscribe('chat-channel');
    };
  }, []);

  const sendMessage = async () => {
    await axios.post('/api/messages', {
      username: 'User1',
      message: input,
    });
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}:</strong> {msg.message}
            <span
              style={{
                color: msg.sentimentScore >= 0 ? 'green' : 'red',
                marginLeft: '8px',
              }}
            >
              Sentiment: {msg.sentimentScore}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}