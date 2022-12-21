import { transportAuth } from './mailer.js'
import { Config } from '../../config/config.js'

export const sendConfirmationEmail = (req, res, name, email, code) => {
    transportAuth.sendMail({
        from: Config.AuthConfig.user,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email</p>
        <p>${code}</p>
        </div>`,
    }).then(() => {
        res.redirect('/flow')
    }).catch(err => console.log(err))
}