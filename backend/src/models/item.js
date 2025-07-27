import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number,
  category: String,
  photo: String,
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }
});

export default mongoose.model("Item", itemSchema);