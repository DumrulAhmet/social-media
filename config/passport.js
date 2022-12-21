import { Strategy } from 'passport-google-oauth20'
import { GoogleAuth } from './authConfig.js'

export const passportConfig = (passport) => {

    passport.use(
        new Strategy(
            {
                clientID: GoogleAuth.ClientID,
                clientSecret: GoogleAuth.ClientSecret,
                callbackURL: '/user/google_auth',
            },

            async (accessToken, refreshToken, profile, done) => {
                return done(null, profile);
            }

        )
    )
    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });
    
    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
}
