const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    content: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "sent",
      enum: ["sent", "delivered", "read"],
    },
    readList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deliveredList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Message", schema);
