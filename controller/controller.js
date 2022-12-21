
import {
    getLogin,
    Login,
    Register,
    getEmailVerify,
    postEmailVerify,
    postEmailVerifyRepeat,
    getForgotPassword,
    getNewPassword,
    postForgotPassword,
    postNewPassword,
    getForgotVerify,
    postForgotVerify,
    google_sign,
    postGoogleSign,
    getEmailCreateVerify,
    postEmailCreateVerify,
    Logout
} from "./user/user.js";
import {
    getHome
} from './home/home.js'
import {
    getFlow,
    postFlow,
    postComment,
    getComment,
    postLike,
    getAction,
    getProfile,
    getProfiles,
    postFollowing,
    postAction,
    postChatUsers,
    getChatUsers,
    getMessages,
    ChatSlug

} from "./flow/flow.js";
export const getUserController = {
    getLogin,
    getEmailVerify,
    getForgotPassword,
    getNewPassword,
    getForgotVerify,
    getEmailCreateVerify,
    Logout
}

export const postUserController = {
    Login,
    Register,
    postEmailVerify,
    postEmailVerifyRepeat,
    postNewPassword,
    postForgotPassword,
    postForgotVerify,
    google_sign,
    postGoogleSign,
    postEmailCreateVerify
}
export const getHomeController = {
    getHome
}
export const getFlowController = {
    getFlow,
    getComment,
    getAction,
    getProfile,
    getProfiles,
    getChatUsers,
    getMessages,
    ChatSlug
    
}
export const postFlowController = {
    postFlow,
    postComment,
    postLike,
    postFollowing,
    postAction,
    postChatUsers,
  
    
}
