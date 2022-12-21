import { User } from "../../model/Mongo/User.js";
import { Post } from "../../model/Mongo/Post.js";
import { UserRequests } from "../../model/Mongo/UserRequests.js";
import { Comment } from "../../model/Mongo/Comment.js";
import { isUser, Jwt } from "../../middleware/middleware.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { server } from "../../app.js";

export const getFlow = async (req, res) => {
  const token = req.session.user;
  if (token) {
    const email = Jwt.jwt_verify(token);
    if (email !== "no_session") {
      isUser.isUserAuth(req, res, email.data);
      const user = await User.find({ email: email.data });
      const users = await User.find();
      const posts = await Post.find()
        .populate({
          path: "user",
        })
        .populate({
          path: "comment",
          populate: {
            path: "user",
            path: "child_comment",
            populate: {
              path: "user",
            },
          },
        });
      const found = user[0].likes.find((item) => {
        return new mongoose.Types.ObjectId(item._id).toHexString();
      });
      const found_id = new mongoose.Types.ObjectId(found).toHexString();
      res.render("flow/flow", {
        user,
        users,
        posts,
        length: posts.length,
        found_id,
      });
    } else {
      res.redirect(`/user?message=${email}`);
    }
  } else {
    res.redirect("/user?message=no_login");
  }
};
export const postFlow = async (req, res) => {
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const user_id = await User.find({ email: email.data });
  const id = new mongoose.Types.ObjectId(user_id[0]._id).toHexString();
  const { post_textarea } = req.body;
  const post = await Post.create({ description: post_textarea, user: id });
  await post.save();
  const userById = await User.findById(id);
  userById.posts.push(post);
  await userById.save();
  const user = await User.find();
  res.redirect("/flow");
};
export const postComment = async (req, res) => {
  const comment = req.headers.body;
  const post_id = req.headers.body1;

  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const user_id = await User.find({ email: email.data });
  const id = new mongoose.Types.ObjectId(user_id[0]._id).toHexString();
  const comments = await Comment.create({
    text: comment,
    user: id,
    post: post_id,
  });
  const comment_id = new mongoose.Types.ObjectId(comments._id).toHexString();

  await comments.save();
  const post = await Post.findById(post_id);
  await post.comment.push(comments);
  await post.save();
};
export const getComment = async (req, res) => {
  const comment_id = req.headers.body;
  const text = req.headers.body1;
  const post_id = req.headers.body2;
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const user_id = await User.find({ email: email.data });
  const id = new mongoose.Types.ObjectId(user_id[0]._id).toHexString();
  const sub_comment_id = await Comment.findById(comment_id);
  const sub_comment = await Comment.create({ text, user: id, post: post_id });
  sub_comment_id.child_comment.push(sub_comment);
  await sub_comment_id.save();
};
export const postLike = async (req, res) => {
  const post_id = req.headers.body;
  const isLike = req.headers.body1;
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);

  const user = await User.find({ email: email.data });

  User.find({ email: email.data })
    .populate({
      path: "likes",
      match: {
        _id: post_id,
      },
    })
    .then(async (user) => {
      const post = await Post.findById(post_id);
      if (user[0].likes.length > 0) {
        const id = new mongoose.Types.ObjectId(user[0].likes._id).toHexString();
        const found = user[0].likes.find((item) => {
          return (
            post_id === new mongoose.Types.ObjectId(item._id).toHexString()
          );
        });
        const pst_id = new mongoose.Types.ObjectId(found._id).toHexString();
        if (pst_id === post_id) {
          await Post.findByIdAndUpdate(post_id, {
            $inc: { like_counter: -1 },
          }).exec();
          user[0].likes.pull(post);
          user[0].save();
        } else {
          await Post.findByIdAndUpdate(post_id, {
            $inc: { like_counter: 1 },
          }).exec();
          await Post.findByIdAndUpdate(post_id, {
            $inc: { view_counter: 1 },
          }).exec();
          user[0].likes.push(post);
          user[0].save();
        }
      } else {
        const post = await Post.findById(post_id);
        await Post.findByIdAndUpdate(post_id, {
          $inc: { like_counter: 1 },
        }).exec();
        await Post.findByIdAndUpdate(post_id, {
          $inc: { view_counter: 1 },
        }).exec();
        user[0].likes.push(post);
        user[0].save();
      }
    });
};
export const getAction = async (req, res) => {
  const token = req.session.user;
  if (token) {
    const email = Jwt.jwt_verify(token);
    if (email !== "no_session") {
      const follow_user = await User.find({ email: email.data }).populate({
        path: "following_user",
      });

      const user = await User.find({ email: email.data }).populate({
        path: "user_response",
      });

      res.render("flow/action", {
        user,
        follow_response: user[0].user_response,
        follow_user: follow_user[0].following_user,
      });
    } else {
      res.redirect(`/user?message=${email}`);
    }
  } else {
    res.redirect("/user?message=no_login");
  }
};
export const getProfile = async (req, res) => {
  const token = req.session.user;
  if (token) {
    const email = Jwt.jwt_verify(token);
    if (email !== "no_session") {
      const user = await User.find({ email: email.data });
      res.render("flow/profile", { user });
    } else {
      res.redirect(`/user?message=${email}`);
    }
  } else {
    res.redirect("/user?message=no_login");
  }
};
export const getProfiles = async (req, res) => {
  const profile = req.params.slug;
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const user = await User.find({ slug: profile });
  const follow_user_id = new mongoose.Types.ObjectId(user[0]._id).toHexString();
  const token_user = await User.find({ email: email.data }).populate({
    path: "following_user",
    match: { _id: follow_user_id },
  });
  if (token) {
    if (token_user[0].slug == profile) {
      res.redirect("/profile");
    } else {
      user_id = new mongoose.Types.ObjectId(user[0]._id).toHexString();
      const follow_user = await User.find({ email: email.data }).populate({
        path: "follow_user",
        match: { _id: user_id },
      });
      const following_user = await User.find({ email: email.data }).populate({
        path: "user_request",
        match: { _id: user_id },
      });
      res.render("flow/profile-slug", {
        user: token_user,
        following_user: token_user[0].following_user.length,
        users: user,
        message: " ",
        profile,
        follow_user: follow_user[0].follow_user.length,
        is_follow: following_user[0].user_request.length,
      });
    }
    var user_id;
  } else {
    res.render("flow/profile-slug", { user, message: "no_session" });
  }
};
export const postFollowing = async (req, res) => {
  const follow = req.body.slug;
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const user = await User.find({ email: email.data });
  const follow_user = await User.find({ slug: follow });
  const id = new mongoose.Types.ObjectId(user[0]._id).toHexString();
  const follow_id = new mongoose.Types.ObjectId(
    follow_user[0]._id
  ).toHexString();
  if (token) {
    await user[0].user_request.push(follow_user[0]._id);
    await user[0].save();
    await follow_user[0].user_response.push(user[0]._id);
    await follow_user[0].save();

    res.redirect(`/profile/${follow}`);
  } else {
    res.redirect(`/profile/${follow}`);
  }
};
export const postAction = async (req, res) => {
  const { slug } = req.body;
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const user_follow = await User.find({ slug });
  const follow_id = new mongoose.Types.ObjectId(
    user_follow[0]._id
  ).toHexString();
  const user = await User.find({ email: email.data }).populate({
    path: "user_response",
    match: { _id: follow_id },
  });
  await user[0].following_user.push(user[0].user_response[0]._id);
  await user_follow[0].follow_user.push(user[0]._id);
  await user_follow[0].user_request.pull(user[0]._id);
  await user[0].user_response.pull(user_follow[0]._id);
  await user_follow[0].save();
  await user[0].save();
  res.redirect("/action");
};
export const postChatUsers = async (req, res) => {
  const { slug } = req.body;
  const token = req.session.user;
  const email = Jwt.jwt_verify(token);
  const chat_user = await User.find({ slug });
  const chat_user_id = new mongoose.Types.ObjectId(
    chat_user[0]._id
  ).toHexString();
  const user = await User.find({ email: email.data });
  const user_id = new mongoose.Types.ObjectId(user[0]._id).toHexString();

  const user_control = await User.find({ email: email.data }).populate({
    path: "chat_users",
    match: { _id: chat_user_id },
  });
  const chat_user_control = await User.find({ slug }).populate({
    path: "chat_users",
    match: { _id: user_id },
  });

  if (
    user_control[0].chat_users.length > 0 &&
    chat_user_control[0].chat_users.length > 0
  ) {
    res.redirect("/chat");
  } else {
    var room_name = chat_user[0].name + "-" + user[0].name
    await chat_user[0].chat_users.push(user_id);
    await chat_user[0].chat_rooms.push(room_name);
    await user[0].chat_rooms.push(room_name);
    await user[0].chat_users.push(chat_user_id);
    await chat_user[0].save();
    await user[0].save();
    res.redirect("/chat");
  }
};
export const getChatUsers = async (req, res) => {
  const token = req.session.user;
  if (token) {
    const email = Jwt.jwt_verify(token);
    const user = await User.find({ email: email.data }).populate({
      path: "chat_users",
    }).populate({
      path:"chat_rooms"
    })
    res.render("flow/chat", {
      user,
      chat_user: user[0].chat_users,
    });
  } else {
    res.redirect("/user?message=no_login");
  }
};
export const getMessages = async (req, res) => {
  const token = req.session.user;
  if (token) {
    const email = Jwt.jwt_verify(token);
    const user = await User.find({ email: email.data }).populate({
      path: "chat_users",
    });
    res.json({
      user,
    });
  }
};

export const ChatSlug = async (req,res) => {
  const token = req.session.user;
  const room_name = req.params.room_name
  if (token) {
    const email = Jwt.jwt_verify(token);
    const user = await User.find({ email: email.data }).populate({
      path: "chat_users",
    })
    const room_users = await User.find({}).populate({
      path:"chat_rooms",
      match:{room_name}
    })
    res.render("flow/chat-slug", {
      user,
      chat_user: user[0].chat_users,
    });
  } else {
    res.redirect("/user?message=no_login");
  }
}
