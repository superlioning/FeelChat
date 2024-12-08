// app/api/messages/route.js
import { NextResponse } from "next/server";
import pusher from "../../utils/pusherServer";

export async function POST(request) {
  const { username, message, channel, messageId, action } =
    await request.json();

  if (action === "edit") {
    await pusher.trigger(channel, "edit-message", {
      messageId,
      message,
      timestamp: Date.now(),
    });
    return NextResponse.json({ status: "Message edited" });
  }

  if (action === "delete") {
    await pusher.trigger(channel, "delete-message", {
      messageId,
    });
    return NextResponse.json({ status: "Message deleted" });
  }

  const newMessageId = Date.now().toString();
  await pusher.trigger(channel, "new-message", {
    messageId: newMessageId,
    username,
    message,
    timestamp: Date.now(),
  });

  return NextResponse.json({ messageId: newMessageId });
}
