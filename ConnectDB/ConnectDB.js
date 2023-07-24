const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.CONNECTION_URI;
  await mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    .then(() => {
      console.log(`Server connected to MONGODB Atlas!`);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectDB;