export const UserAlerts = (message) => {
    var messages = ""
    switch (message) {
        case 'no_match':
            messages = "Password No Match"
            break;
        case 'success':
            messages = "User Success Create"
            break;
        case 'no_user':
            messages = "User Not Found"
            break;
        case 'already_email':
            messages = "Already Email"
            break;
        case 'wrong_password':
            messages = "Password Wrong"
            break;
        case 'no_check':
            messages = "Please Checked"
            break;
        case 'no_email_code':
            messages = "Email Verify Code no Match"
            break;
        case 'update_user':
            messages = "User Update"
            break;
        case 'error':
            messages = " something went wrong"
            break;
        case 'no_token':
            messages = "invalid token please try again"
            break;
        case 'already_user':
            messages = "there is already such a user"
            break;
        case 'no_login':
            messages = "please login"
            break;
        case 'no_session':
            messages = "session expired"
            break;
        default:
            messages = ""
            break;

    }
    return messages
}