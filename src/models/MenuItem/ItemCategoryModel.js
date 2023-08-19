const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
  ItemImage: { type: String },
  ItemCategory: { type: String, unique: true },
}, { versionKey: false });
const ItemCategoryModel = mongoose.model('ItemCategories', DataSchema);
module.exports = ItemCategoryModel;
