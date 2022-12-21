import jwt from 'jsonwebtoken'
import { secret_key } from './secret_keys.js'
export const jwt_verify = (token) => {
    const jwtVerify = jwt.verify(token, secret_key, (err, decode) => {
        if (err) {
            return 'no_session'
        } else {
            return decode
        }
    })
    return jwtVerify
}