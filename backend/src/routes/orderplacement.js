import express from "express";
import Order from "../models/order.js";
import Item from "../models/item.js";
import Supplier from "../models/Supplier.js";

const router = express.Router();

// Place new order
router.post("/", async (req, res) => {
  const { itemId } = req.body;
  const item = await Item.findById(itemId).populate("supplier");
  if (!item) return res.status(404).json({ message: "Item not found" });

  const order = new Order({
    item: item._id,
    supplier: item.supplier._id,
    status: "Pending"
  });
  await order.save();

  res.status(201).json(order);
});

export default router;