import jwt from "jsonwebtoken";
import { secret_key } from "./secret_keys.js";
export const jwt_sign = (email) => {
    const token = jwt.sign({data:email},secret_key,{ expiresIn: 60 * 60 })
    return token
}