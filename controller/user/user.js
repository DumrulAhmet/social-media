//import { User } from "../../model/Postgres/User/User.js"
import { User } from "../../model/Mongo/User.js";
import { Utility } from "../../utility/utility.js";
import bcryptjs from "bcryptjs";
import { Jwt } from "../../middleware/middleware.js";
import { mail } from "../../middleware/middleware.js";
import Cryptr from "cryptr";
import randomatic from "randomatic";
import { secret_key } from "../../middleware/token/secret_keys.js";
import { Post } from "../../model/Mongo/Post.js";
import { Comment } from "../../model/Mongo/Comment.js";
import slugify from "slugify";

export const Register = (req, res) => {
  const {
    name,
    lastname,
    email,
    phone,
    membership_type,
    password,
    password_repeat,
    check,
  } = req.body;
  if (password !== password_repeat) {
    res.redirect("/user?message=no_match");
  } else if (!check) {
    res.redirect("/user?message=no_check");
  } else {
    bcryptjs.hash(password, 10, (err, hash) => {
      if (err) console.error(err);
      else {
        User.find({ email }).then((user) => {
          if (user.length > 0) {
            res.redirect("/user?message=already_email");
            if (user[0].isSignConfirm === true) {
              res.redirect("/user?message=no_token");
            }
          } else {
            const cryptr = new Cryptr(secret_key);
            const code = randomatic("*", 15);
            const code_en = cryptr.encrypt(code);
            const email_en = cryptr.encrypt(email);
            const name_en = cryptr.encrypt(name);
            const lastname_en = cryptr.encrypt(lastname);
            const phone_en = cryptr.encrypt(phone);
            const membership_type_en = cryptr.encrypt(membership_type);
            const password_en = cryptr.encrypt(password);
            mail.sendConfirmationEmail(req, res, name, email, code);
            if (res.headersSent !== true) {
              res.redirect(
                `/user/email_verify_create?auth=${code_en}&&auth1=${email_en}&&auth_name=${name_en}&&auth_lastname=${lastname_en}&&auth_phone=${phone_en}&&membership_type=${membership_type_en}&&password=${password_en}`
              );
            }
          }
        });
      }
    });
  }
};
export const getEmailCreateVerify = (req, res) => {
  const {
    auth,
    auth1,
    auth_name,
    auth_lastname,
    auth_phone,
    membership_type,
    password,
    message,
  } = req.query;
  const cryptr = new Cryptr(secret_key);
  const email = cryptr.decrypt(auth1);
  User.find({ email }).then((user) => {
    if (user.length > 0) {
      if (user[0].isSignConfirm) {
        res.redirect("/user?message=already_user");
      }
    } else {
      const messages = Utility.UserAlerts(message);
      res.render("home/create-verify-email", {
        auth,
        auth1,
        messages,
        auth_name,
        auth_lastname,
        auth_phone,
        membership_type,
        password,
      });
    }
  });
};
export const postEmailCreateVerify = (req, res) => {
  const {
    auth,
    auth1,
    name_en,
    verifyCode,
    lastname_en,
    phone_en,
    membership_type_en,
    password_en,
  } = req.body;

  const cryptr = new Cryptr(secret_key);
  const code = cryptr.decrypt(auth);
  const email = cryptr.decrypt(auth1);
  const name = cryptr.decrypt(name_en);
  const lastname = cryptr.decrypt(lastname_en);
  const phone = cryptr.decrypt(phone_en);
  const password = cryptr.decrypt(password_en);
  const membership_type = cryptr.decrypt(membership_type_en);
  if (code === verifyCode) {
    const slug = slugify(name + " " + lastname + `${Math.random()}`);
    bcryptjs.hash(password, 10, (err, hash) => {
      if (err) console.log(err);
      else {
        User.create({
          name,
          lastname,
          email,
          phone,
          membership_type,
          slug,
          password: hash,
          isSignConfirm: true,
        }).then(() => {
          res.redirect("/user?message=success");
        });
      }
    });
  } else {
    res.redirect(
      `/user/email_verify_create?auth=${code_en}&&auth1=${email_en}&&auth_name=${name_en}&&auth_lastname=${lastname_en}&&auth_phone=${phone_en}&&membership_type=${membership_type_en}&&password=${password_en}`
    );
  }
};
export const Login = async (req, res) => {
  const { email, password, remember_me } = req.body;

  User.find({ email }).then(async (user) => {
    if (user.length === 0) res.redirect("/user?message=no_user");
    else {
      if (user[0].isAuth0) {
        const token = Jwt.jwt_sign(user[0].email);
        bcryptjs.compare(password, user[0].password).then(async (result) => {
          if (!result) res.redirect("/user?message=wrong_password");
          else {
            const cryptr = new Cryptr(secret_key);
            const code = randomatic("*", 15);
            const code_en = cryptr.encrypt(code);
            const email_en = cryptr.encrypt(user[0].email);
            const remember_me_en = cryptr.encrypt(remember_me);

            mail.sendConfirmationEmail(
              req,
              res,
              user[0].name,
              user[0].email,
              code
            );
            if (res.headersSent !== true) {
              await res.redirect(
                `/user/email_verify?auth=${code_en}&&auth1=${email_en}&&remember_me=${remember_me_en}`
              );
            }
          }
        });
      } else {
        bcryptjs.compare(password, user[0].password).then(async (result) => {
          if (!result) {
            res.redirect("/user?message=wrong_password");
          } else {
            const token = Jwt.jwt_sign(email);
            if (remember_me) {
              req.session.cookie.maxAge = 2628000000;
            }
            req.session.user = token;
            await User.updateOne({email:user[0].email},{is_online:true})
            res.redirect("/flow");
          }
        });
      }
    }
  });
};
export const getLogin = (req, res) => {
  const token = req.session.user;
  const token_v = Jwt.jwt_verify(token);
  if (token_v !== "no_session") {
    res.redirect("/flow");
  } else {
    const { message } = req.query;
    const messages = Utility.UserAlerts(message);
    res.render("home/login", { messages });
  }
};
export const getEmailVerify = (req, res) => {
  const { auth, auth1, remember_me, message } = req.query;
  const messages = Utility.UserAlerts(message);
  const cryptr = new Cryptr(secret_key);
  const email = cryptr.encrypt(auth1);
  const remember_me_de = cryptr.encrypt(remember_me);

  res.render("home/verify-email", { auth, auth1, messages, remember_me_de });
};
export const postEmailVerify = async (req, res) => {
  const { auth, verifyCode, auth1, remember_me } = req.body;
  const cryptr = new Cryptr(secret_key);
  const code_de = cryptr.decrypt(auth);
  const email_de = cryptr.decrypt(auth1);
  const remember_me_de = cryptr.decrypt(remember_me);
  if (code_de === verifyCode) {
    const token = Jwt.jwt_sign(email_de);
    if (remember_me_de) {
      req.session.cookie.maxAge = 2628000000;
    }
    req.session.user = token;
    await User.updateOne({email:email_de},{is_online:true})
    res.redirect("/flow");
  } else {
    res.redirect(
      `/user/email_verify?auth=${auth}&&auth1=${auth1}&&message=no_email_code`
    );
  }
};
export const postEmailVerifyRepeat = (req, res) => {
  const { auth1 } = req.body;
  const cryptr = new Cryptr(secret_key);
  const code = randomatic("*", 15);
  const email_de = cryptr.decrypt(auth1);

  const email_en = cryptr.encrypt(email_de);
  const code_en = cryptr.encrypt(code);
  User.find({ email: email_de }).then((user) => {
    mail.sendConfirmationEmail(req, res, user[0].name, user[0].email, code);
    res.redirect(`/user/email_verify?auth=${code_en}&&auth1=${email_en}`);
  });
};
export const getForgotPassword = (req, res) => {
  const { message } = req.query;
  const messages = Utility.UserAlerts(message);
  res.render("home/forgot-password", { messages });
};
export const postForgotPassword = (req, res) => {
  const { email } = req.body;
  User.find({ email }).then((user) => {
    if (user.length > 0) {
      const cryptr = new Cryptr(secret_key);
      const code = randomatic("*", 15);
      const email_en = cryptr.encrypt(email);
      const code_en = cryptr.encrypt(code);
      mail.sendConfirmationEmail(req, res, user[0].name, user[0].email, code);
      res.redirect(`/user/forgot_verify?auth=${email_en}&&auth1=${code_en}`);
    } else {
      res.redirect("/user/forgot_password?message=no_user");
    }
  });
};

export const getForgotVerify = (req, res) => {
  const { auth, auth1 } = req.query;
  res.render("home/forgot-password-verify", { auth1, auth });
};
export const postForgotVerify = (req, res) => {
  const { auth, auth1, verify_code } = req.body;
  const cryptr = new Cryptr(secret_key);
  const email_de = cryptr.decrypt(auth);
  const code_de = cryptr.decrypt(auth1);
  if (code_de === verify_code) {
    const email_en = cryptr.encrypt(email_de);
    res.redirect(`/user/new_password?auth=${email_en}`);
  } else {
    res.redirect("");
  }
};

export const getNewPassword = (req, res) => {
  const { auth } = req.query;
  const cryptr = new Cryptr(secret_key);
  const email = cryptr.decrypt(auth);
  User.find({ email }).then((user) => {
    if (user[0].isPasswordConfirm) {
      User.updateOne({ email })
        .update({
          isPasswordConfirm: false,
        })
        .then(() => {
          res.redirect(`/user/forgot_password`);
        });
    } else {
      res.render("home/user-new-password", { auth });
    }
  });
};
export const postNewPassword = (req, res) => {
  const cryptr = new Cryptr(secret_key);
  const { password, password_repeat, auth } = req.body;
  if (password !== password_repeat) {
    res.redirect(`/user/new_password?auth=${auth}`);
  } else {
    const email_de = cryptr.decrypt(auth);

    bcryptjs.hash(password, 10, (err, hash) => {
      User.updateMany({ email: email_de })
        .update({
          password: hash,
          isPasswordConfirm: true,
        })
        .then(() => {
          res.redirect("/user?message=update_user");
        })
        .catch(() => {
          console.log(err);
          res.redirect("/user?message=error");
        });
    });
  }
};
export const google_sign =  (req, res) => {
  const user = req.user;
  const { message } = req.query;
  const messages = Utility.UserAlerts(message);
  const token = req.session.user;
  const token_v = Jwt.jwt_verify(token);
  User.find({ email: user.emails[0].value }).then( async (users) => {
    if (users.length > 0) {
      const token = Jwt.jwt_sign(user.emails[0].value);
      req.session.user = token;
      await User.updateOne({email:user.emails[0].value},{is_online:true})
      res.redirect("/flow");
    } else {
      res.render("home/google-new-password", {
        name: user.name.givenName,
        lastname: user.name.familyName,
        email: user.emails[0].value,
        picture: user.photos[0].value,
        messages,
      });
    }
  });
};
export const postGoogleSign = (req, res) => {
  const {
    name,
    lastname,
    email,
    picture,
    password,
    password_repeat,
    membership_type,
  } = req.body;
  if (password === password_repeat) {
    const slug = slugify(name + " " + lastname + `${Math.random()}`);
    bcryptjs.hash(password, 10, (err, hash) => {
      User.create({
        name,
        lastname,
        email,
        image: picture,
        slug,
        password: hash,
        membership_type,
      }).then(() => {
        res.redirect("/user");
      });
    });
  } else {
    res.redirect("/user/google_sign?message=no_match");
  }
};
export const Logout = async (req, res) => {
  await User.updateOne({email:req.session.passport.user.emails[0].value},{is_online:false})
  req.session.destroy(async (err) => {
    if (err) console.log(err);
    res.redirect("/user");
  });
};
