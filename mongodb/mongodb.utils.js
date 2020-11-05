const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect(process.env.MONGODB_URL);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const dropCollection = async collectionName => {
  try {
    await mongoose.connection.collection(collectionName).drop();
  } catch (err) {
    if (err.code === 26) {
      console.log('namespace %s not found', collectionName);
    }
    console.log(err);
    throw new Error(err);
  }
};

module.exports = {
  connect,
  disconnect,
  dropCollection
};
