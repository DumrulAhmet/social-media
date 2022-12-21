import { getUserController, postUserController } from "../../controller/controller.js";
import express from "express";
import passport from "passport";
const app = express.Router()



export const getLogin = app.get('/user', getUserController.getLogin)
export const Login = app.post('/login', postUserController.Login)
export const Logout = app.get('/logout', getUserController.Logout)
export const Register = app.post('/register', postUserController.Register)

export const getEmailVerify = app.get('/email_verify', getUserController.getEmailVerify)
export const postEmailVerify = app.post('/email_verify', postUserController.postEmailVerify)
export const postEmailVerifyRepeat = app.post('/email_verify_repeat', postUserController.postEmailVerifyRepeat)
export const getForgotPassword = app.get('/forgot_password', getUserController.getForgotPassword)
export const postForgotPassword = app.post('/forgot_password', postUserController.postForgotPassword)
export const getNewPassword = app.get('/new_password', getUserController.getNewPassword)
export const postNewPassword = app.post('/new_password', postUserController.postNewPassword)
export const getForgotVerify = app.get('/forgot_verify', getUserController.getForgotVerify)
export const postForgotVerify = app.post('/forgot_verify', postUserController.postForgotVerify)
export const getGoogleAuth = app.get('/google_auth', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => res.redirect('/user/google_sign'))
export const postGoogleSign = app.get('/google_sign', postUserController.google_sign)
export const postGoogleSignNewPassword = app.post('/google_sign', postUserController.postGoogleSign)
export const getEmailCreateVerify = app.get('/email_verify_create', getUserController.getEmailCreateVerify)
export const postEmailCreateVerify = app.post('/email_verify_create', postUserController.postEmailCreateVerify)