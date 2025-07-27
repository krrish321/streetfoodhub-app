import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Supplier from "../models/Supplier.js";

export const register = async (req, res) => {
  try {
    const { userType, email, password, shopName } = req.body;

    if (!userType || !email || !password || (userType === "owner" && !shopName)) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userType,
      email,
      password: hashedPassword,
      shopName: userType === "owner" ? shopName : undefined,
    });

    await user.save();

    // Vendor ke liye Supplier bhi banao
    let supplierId = null;
    if (userType === "vendor") {
      const supplier = new Supplier({
        name: email.split("@")[0],
        email: email,
        items: []
      });
      await supplier.save();
      supplierId = supplier._id;
    }

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        userType: user.userType,
        email: user.email,
        shopName: user.shopName,
        supplierId // null for owner, id for vendor
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};


export const login = async (req, res) => {
  try {
    const { userType, email, password } = req.body;

    if (!userType || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email, userType });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Vendor ke liye supplierId bhi bhejo
    let supplierId = null;
    if (userType === "vendor") {
      const supplier = await Supplier.findOne({ email });
      supplierId = supplier ? supplier._id : null;
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        userType: user.userType,
        email: user.email,
        shopName: user.shopName,
        supplierId // yeh frontend me localStorage me save karo
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};