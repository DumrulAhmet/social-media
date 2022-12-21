import {
  getFlowController,
  postFlowController,
  
} from "../../controller/controller.js";
import express from "express";
const app = express();

export const getFlow = app.get("/flow", getFlowController.getFlow);
export const postFlow = app.post("/flow-post", postFlowController.postFlow);
export const postComment = app.post("/comment", postFlowController.postComment);
export const getComment = app.get("/comment", getFlowController.getComment);
export const postLike = app.post("/like", postFlowController.postLike);
export const getAction = app.get("/action", getFlowController.getAction);
export const getProfile = app.get("/profile", getFlowController.getProfile);
export const getProfiles = app.get("/profile/:slug", getFlowController.getProfiles);
export const postFollowing = app.post("/profile/follow",postFlowController.postFollowing)
export const postAction = app.post("/action/success",postFlowController.postAction)
export const postChatUser = app.post('/chat',postFlowController.postChatUsers)
export const getChatUsers = app.get('/chat',getFlowController.getChatUsers)
export const getChatMessages = app.get('/chat-messages',getFlowController.getMessages)
export const getSlugChat = app.get('/chat/:room_name',getFlowController.ChatSlug)

