import { jwt_sign } from "./token/jwt_sign.js";
import { jwt_verify } from "./token/jwt_verify.js";
import { sendConfirmationEmail } from './Mail/sendMailTypes.js'
import { transportAuth } from './Mail/mailer.js'
import { isUserAuth } from "./isUserAuth.js";

export const Jwt = {
    jwt_sign, jwt_verify
}
export const mail = {
    sendConfirmationEmail, transportAuth
}
export const isUser = {
    isUserAuth
}
