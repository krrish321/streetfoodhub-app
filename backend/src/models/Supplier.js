import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});

export default mongoose.model("Supplier", supplierSchema);