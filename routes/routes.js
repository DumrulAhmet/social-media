import {
    getFlow,
    postFlow,
    postLike,
    getAction,
    getProfile,
    getProfiles,
    postFollowing,
    postAction,
    postChatUser,
    getChatUsers,
    getChatMessages,
    getSlugChat
    
} from './Flow/flow.js'
import {
    getHome
} from './Home/home.js'
import {
    Login,
    Register,
    getLogin,
    getEmailVerify,
    postEmailVerify,
    postEmailVerifyRepeat,
    getForgotPassword,
    getNewPassword,
    postForgotPassword,
    postNewPassword,
    getForgotVerify,
    postForgotVerify,
    getGoogleAuth,
    postGoogleSign,
    postGoogleSignNewPassword,
    Logout
} from './User/user.js'


export const HomeRoutes = {
    getHome
}
export const UserRoutes = {
    Login,
    Register,
    getLogin,
    getEmailVerify,
    postEmailVerify,
    postEmailVerifyRepeat,
    getForgotPassword,
    getNewPassword,
    postForgotPassword,
    postNewPassword,
    getForgotVerify,
    postForgotVerify,
    getGoogleAuth,
    postGoogleSign,
    postGoogleSign,
    postGoogleSignNewPassword,
    Logout

}
export const FlowRoutes = {
    getFlow,
    postFlow,
    postLike,
    getAction,
    getProfile,
    getProfiles,
    postFollowing,
    postAction,
    postChatUser,
    getChatUsers,
    getChatMessages,
    getSlugChat
}