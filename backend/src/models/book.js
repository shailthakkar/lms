const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const BookSchema = new Schema({
  uuid: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  borrowedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  // priceHistory: { type: Array, required: true, default: [] },
  // quantityHistory: { type: Array, required: true, default: [] },
});

const BookModel = model("books", BookSchema);

module.exports = { BookModel };
