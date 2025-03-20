import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";
import socketIORedis from "socket.io-redis"; // Importiere socket.io-redis
import { Redis } from "ioredis";
import { createShardedAdapter } from "@socket.io/redis-adapter";

export const redisPubClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379
});

export const redisSubClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379
});

// Benutzer-Sockets in Redis speichern
const userSocketMapKey = "userSocketMap";

let io;

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
    adapter: createShardedAdapter(redisPubClient, redisSubClient.duplicate())

  });

  /*
  // Redis Adapter für Socket.IO
  io.adapter(createShardedAdapter({
    pubClient: redisPubClient, // Verwende die gemeinsame Verbindung
    subClient: redisSubClient.duplicate() // Erstellt eine zweite Verbindung für Abonnements
  }));

*/



  const disconnect = async (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    await redisPubClient.hdel(userSocketMapKey, userId);
  };



  const sendMessage = async (message) => {

    if ((!message.content || message.content.trim() === "") && message.messageType !== "file") {
      console.error("Fehler: Nachrichteninhalt fehlt!");
      return;
    }

    const senderSocketId = await redisPubClient.hget(userSocketMapKey, message.sender);
    const recipientSocketId = await redisPubClient.hget(userSocketMapKey, message.recipient);


    
    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");


    if (recipientSocketId) {

      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };


    if (channel && channel.members) {
      for (const member of channel.members) {
        const memberSocketId = await redisPubClient.hget(userSocketMapKey, member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      };

      const adminSocketId = await redisPubClient.hget(userSocketMapKey, channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      redisPubClient.hset(userSocketMapKey, userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);

    } else {
      console.log("User ID not provided during connection");
    }


    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("addChannel", async (channel) => {
      console.log("tset........");
      for (const member of channel.members) {
        if (!member || !member._id) {
          console.warn("Fehlendes Mitglied oder _id:", member);
          
        }
        const memberSocketId = await redisPubClient.hget(userSocketMapKey, member);
        if (memberSocketId) {
          console.log(memberSocketId);
          io.to(memberSocketId).emit("add-channel", channel);
        }
      };

    });
    socket.on("disconnect", () => disconnect(socket));
  });

  return io;
};

// Export the io instance
export { io };

export default setupSocket;