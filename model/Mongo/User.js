import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
  },
  membership_type: {
    type: String,
    required: true,
  },
  reference_code: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  solution_view_counter: {
    type: Number,
    default: 0,
  },
  view_counter: {
    type: Number,
    default: 0,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  isAuth0: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    default: "",
  },
  isSignConfirm: {
    type: Boolean,
    default: false,
  },
  isPasswordConfirm: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  follow_user: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  following_user: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  user_request: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  user_response: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  chat_users: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  chat_messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },
  ],
  is_online: {
    type: Boolean,
    default: false,
  },
  chat_rooms:[
    {
      type:String,
      default:""
    }
  ]
});
UserSchema.plugin(mongooseAutoPopulate);
export const User = mongoose.model("User", UserSchema);
