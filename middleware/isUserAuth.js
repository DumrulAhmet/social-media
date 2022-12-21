export const isUserAuth = (req, res, user) => {
    if (!user) {
        res.redirect('/user')
    } 
}