import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["vendor", "owner"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  shopName: {
    type: String,
    required: function () {
      return this.userType === "owner";
    },
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);