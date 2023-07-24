const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    image_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Images",
    },
    likes_count: {
      type: Number,
      required: true,
      default: 0
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Likes", likeSchema);


