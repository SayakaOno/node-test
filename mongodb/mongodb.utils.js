const mongoose = require('mongoose');
const { URL } = require('../config');

const connect = async () => {
  try {
    await mongoose.connect(URL, {
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
    await mongoose.disonnect(URL);
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
