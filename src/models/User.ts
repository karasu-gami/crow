import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  economy: {
    wallet: {
      type: Number,
      default: 500,
    },
  },
  rank: {
    exp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    levelUpExp: {
      type: Number,
      default: 100,
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
