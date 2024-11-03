// app/api/messages/route.js
import { NextResponse } from 'next/server';
import pusher from '../../utils/pusherServer';
import { analyzeMessage } from '../../utils/analyzeSentiment';

export async function POST(request) {
  const { username, message } = await request.json();
  const sentiment = analyzeMessage(message);

  // Broadcast message to Pusher channel
  await pusher.trigger('chat-channel', 'new-message', {
    username,
    message,
    sentimentScore: sentiment.score,
  });

  return NextResponse.json({ status: 'Message sent' });
}