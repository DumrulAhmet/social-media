import nodemailer from 'nodemailer'
import { Config } from '../../config/config.js'

export const transportAuth = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: Config.AuthConfig.user,
        pass: Config.AuthConfig.pass
    }
})
