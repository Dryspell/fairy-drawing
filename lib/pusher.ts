import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "123456",
  key: process.env.PUSHER_APP_KEY || "123456",
  secret: process.env.PUSHER_APP_SECRET || "123456",
  cluster: process.env.PUSHER_APP_CLUSTER || "us2",
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.PUSHER_APP_KEY || "123456",
  {
    cluster: process.env.PUSHER_APP_CLUSTER || "us2",
    forceTLS: true,
  }
);
