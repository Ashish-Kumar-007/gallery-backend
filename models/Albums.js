const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: { 
      type: String 
    },
    album_image:{
      type: String,
      require: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Albums", albumSchema);
