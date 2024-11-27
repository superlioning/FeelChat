// app/api/messages/route.js
import { NextResponse } from 'next/server';
import pusher from '../../utils/pusherServer';

export async function POST(request) {
  const { username, message, channel } = await request.json();

  // Broadcast message to the specified Pusher channel
  await pusher.trigger(channel, 'new-message', {
    username,
    message,
  });

  return NextResponse.json({ status: 'Message sent' });
}