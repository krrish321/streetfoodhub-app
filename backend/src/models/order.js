import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);