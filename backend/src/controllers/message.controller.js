import cloudinary from "../utils/configs/cloudinary.js";

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../utils/configs/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Message.find({
      $or: [
        {
          senderId: loggedInUserId,
        },
        {
          receiverId: loggedInUserId,
        },
      ],
    })
      .sort("-createdAt")
      .select("senderId receiverId");

    const userIds = [
      ...new Set(
        conversations.flatMap((convo) => [
          convo.senderId.toString(),
          convo.receiverId.toString(),
        ])
      ),
    ].filter((id) => id !== loggedInUserId.toString());

    const filteredUsers = await Promise.all(
      userIds.map(async (el) => await User.findById(el).select("-password"))
    );

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(
      "An internal server error occured in getUsers for sidebar",
      error.message
    );
    return res.status(500).json({
      message: `An internal server error occurred in get users for sidebar, ${error.message}`,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    }).sort("createdAt");
    return res.status(200).json(messages);
  } catch (error) {
    console.log(
      "An internal server error occured in getMessages",
      error.message
    );
    return res.status(500).json({
      message: `An internal server error occurred in getMessages, ${error.message}`,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("An internal server error occured", error.message);
    return res.status(500).json({
      message: `An internal server error occurred, ${error.message}`,
    });
  }
};
