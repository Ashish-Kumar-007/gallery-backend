const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    image_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Images",
    },
    likes_count: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Likes", likeSchema);


