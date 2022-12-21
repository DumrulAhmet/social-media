import express from 'express'
import { fileURLToPath } from 'url';
import { join, dirname } from 'path'
import BodyParser from 'body-parser';
import helmet, { contentSecurityPolicy } from 'helmet'
import session from 'express-session';
import { Config } from './config/config.js';
import { notFound } from './middleware/notFound.js';
import passport from 'passport';
import connectRedis from 'connect-redis'
import https from 'https'
import fs from 'fs'




//import { database } from './db/db.js';
import { HomeRoutes, UserRoutes, FlowRoutes } from './routes/routes.js'

// Chat
import {Chat } from './controller/chat/chat.js'

import { database } from './db/db.js'


const RedisStore = connectRedis(session)
await Config.Redis.redisClient.connect()
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
Config.InstallServerConfig()

app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))

app.use(express.static(join(__dirname, 'public')))
app.use(BodyParser.urlencoded({ extended: true }))
app.use(helmet({ contentSecurityPolicy: false }))
app.use(session({
    secret: 'radeonares',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({ client: Config.Redis.redisClient }),
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 10
    }

}));
app.use(passport.initialize())
app.use(passport.session())





Config.passportConfig(passport)

app.use('/',
    HomeRoutes.getHome,
    UserRoutes.getLogin,
    FlowRoutes.getFlow,
    FlowRoutes.getAction,
    FlowRoutes.getProfile,
    FlowRoutes.getProfiles,
    FlowRoutes.getChatUsers,
    FlowRoutes.getChatMessages,
    FlowRoutes.getSlugChat
    
)
app.use('/user',
    UserRoutes.Login,
    UserRoutes.Register,
    UserRoutes.getEmailVerify,
    UserRoutes.postEmailVerify,
    UserRoutes.postEmailVerifyRepeat,
    UserRoutes.getForgotPassword,
    UserRoutes.getNewPassword,
    UserRoutes.postForgotPassword,
    UserRoutes.postNewPassword,
    UserRoutes.getForgotVerify,
    UserRoutes.postForgotVerify,
    UserRoutes.getGoogleAuth,
    UserRoutes.postGoogleSign,
    UserRoutes.postGoogleSign,
    UserRoutes.Logout
)
app.use('/flow-post',
    FlowRoutes.postFlow
)
app.get('*', (req, res) => {
    notFound(req, res)
})


database.mongodb.then(() => console.log('connect')).catch((err) => console.log(err))


/* import { Post } from './model/Mongo/Post.js'
import { Comment } from './model/Mongo/Comment.js'
import { User } from './model/Mongo/User.js'

User.deleteMany().all().exec()
Post.deleteMany().all().exec()

Comment.deleteMany().all().exec() */

export const server = https.createServer({
    key: fs.readFileSync('./ssl/keytmp.pem', 'utf-8'),
    cert: fs.readFileSync('./ssl/cert.pem', 'utf-8'),
    passphrase: 'bugisencokyasa32'
}, app)
Chat()
server.listen(8080)
