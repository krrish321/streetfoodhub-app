
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import supplierRoutes from "./routes/Supplier.js";
import orderRoutes from "./routes/orderplacement.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", withCredentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

export default app;