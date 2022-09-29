import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    image: { type: string, required: false },
    comments: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        comment: { type: String },
      },
    ],
    likes: { type: Number, default: 0 },
  },
  { timestamps }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
