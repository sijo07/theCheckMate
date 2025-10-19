import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    profilePic: {
      type: String,
      default: `https://picsum.photos/200?random=${Math.floor(
        Math.random() * 1000
      )}`,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
