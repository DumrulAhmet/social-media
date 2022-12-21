import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const UserRequest = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user_request: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
  ],
  user_response: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
  ],
});
UserRequest.plugin(mongooseAutoPopulate);
export const UserRequests = mongoose.model("UserRequest", UserRequest);
