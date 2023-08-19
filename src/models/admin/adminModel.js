const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
  email: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  phoneNo: { type: String },
  password: { type: String },
  photo: { type: String },
  createdDate: { type: Date, default: Date.now() },
}, { versionKey: false });
const adminModel = mongoose.model('admin', DataSchema);
module.exports = adminModel;
