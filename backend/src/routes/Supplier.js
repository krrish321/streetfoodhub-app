import express from "express";
import Supplier from "../models/Supplier.js";
import Item from "../models/item.js";
import Order from "../models/order.js";

const router = express.Router();




// Get all suppliers with items
router.get("/", async (req, res) => {
  const suppliers = await Supplier.find().populate("items");
  res.json({ suppliers });
});

// Get supplier profile + items
// GET /api/suppliers/:supplierId
router.get("/:supplierId", async (req, res) => {
  const supplier = await Supplier.findById(req.params.supplierId).populate("items");
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });
  res.json(supplier);
});

// Upload new item
router.post("/:supplierId/items", async (req, res) => {
  const { name, stock, price, category, photo } = req.body;
  const supplier = await Supplier.findById(req.params.supplierId);
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  const item = new Item({ name, stock, price, category, photo, supplier: supplier._id });
  await item.save();

  supplier.items.push(item._id);
  await supplier.save();

  res.status(201).json(item);
});

// Get all orders for supplier
router.get("/:supplierId/orders", async (req, res) => {
  const orders = await Order.find({ supplier: req.params.supplierId }).populate("item");
  res.json(orders);
});

// Update order status
router.patch("/orders/:orderId", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
  res.json(order);
});

export default router;