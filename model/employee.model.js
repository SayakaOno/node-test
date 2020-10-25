const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 12
  },
  gender: { type: String },
  phone: { type: String },
  created_date: { type: Date, default: Date.now() }
});

mongoose.pluralize(null);
const employeeModel = mongoose.model('myemployee_test', contactSchema);

module.exports = employeeModel;
