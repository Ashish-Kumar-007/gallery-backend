const mongoose = require("mongoose");

const connectDB = async () => {

  await mongoose
    .connect(process.env.CONNECTION_URI, {
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