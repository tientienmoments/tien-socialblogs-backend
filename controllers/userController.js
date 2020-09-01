const utilsHelper = require("../helpers/utils.helper")
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const userController = {}
const jwt = require("jsonwebtoken")


userController.register = async (req, res, next) => {
  try {

    let { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new Error("User already exists"))

    // encrypt password to can not understand by human

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);


    user = await User.create({
      name,
      email,
      password,

    });
    const accessToken = await user.generateToken();

    return utilsHelper.sendResponse(res,
      200,
      true,
      { user, accessToken },
      user,
      null,
      "Create user succesfully"
    )

  } catch (error) {
    next(error);

  }

}


userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get current user successful"
    );
  } catch (error) {
    next(error);
  }
};

userController.forgetPassword = async (req, res, next) => {
  try {
    // get email from request 
    const email = req.params.email
    console.log(email);
    if (!email) {
      return next(new Error("Email is required"))
    }
    // get user doc from database
    const user = await User.findOne({ email })
    if (!user) {
      return utilsHelper.sendResponse(
        res,
        500,
        false,
        null,
        null,
        "User not found"
      );
    }
    // generate a jwt (include userID)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });

    // SEND EMAIL
    const API_KEY = process.env.MAILGUN_API;
    const DOMAIN = process.env.MAILGUN_DOMAIN;
    const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });
    const data = {
      from: 'khoa <damanhkhoa@gmail.com>',
      to: user.email,
      subject: 'Reset password confirmation',
      html: `click <a href="http://localhost:5000/email/${token}">here</a> to reset password`
    };
    console.log(data);
    mailgun.messages().send(data, (error, body) => {
      console.log(data);
      if (error) {
        console.warn(error);
      } else {
        console.log(body);
      }

      return next(body)
    });

    // send email with token to user email
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      null,
      null,
      "You will receive an email in your registered email address"
    );
  } catch (error) {
    next(error);
  }
}

userController.resetPassword = async (req, res, next)=>{
try{
const {token, password} = req.body;
if(!token || !password) return next(new Error("token and password are required"))

//verify token
const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)

if(!payload){

}

//update password
const user = await User.findById(payload._id)
user.password = password;
await user.save()

res.send(user)

}catch(error){
  next(error)
}

}

userController.updateProfile = async (req, res, next)=>{
try{

  const userId = re.userId;
  const allows = ["name", "password","gender"];
  const user = await User.findOne({_id: userId, isDeleted: false})
  if(!user){
    return next(new Error("acount not found"))
  }
  
  allows.forEach(field => {
    if(req.body[field] !== undefined){
      user[field] = req.body[field]
    }

  })

await user.save()

res.send(user)

return utilsHelper.sendResponse(
  res,
  200,
  true,
  { user },
  null,
  "Update current user successful"
);

}catch(error){
  next(error)
}


}
module.exports = userController;