const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper")
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const axios = require('axios');
const authController = {}

authController.loginWithEmail = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Invalid credentials"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("Wrong password"))
    accessToken = await user.generateToken();
    return sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login with email Successfully"

    )


})

authController.loginWithFacebook = catchAsync(async (req, res, next) => {


    const token = req.params.token;
    const { data } = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`)
    console.log("tien check data facebook", data);

    const { email, name, picture } = data;
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({ email, name, avatar: picture.data.url })
    }
    const accessToken = await user.generateToken();

    // res.send("ok")

    return sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login with Facebook Successfully"

    )
})

authController.loginWithGoogle = catchAsync(async (req, res, next) => {
    const goToken = req.params.token;
    console.log("googleToken:", goToken);
    const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${goToken}`
    );

    const { email, name, picture } = response.data;
    console.log("check data google",response.data)
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({ email, name, avatar: picture });
    }
    const accessToken = await user.generateToken();
    return sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login google successful"
    );
});

module.exports = authController;
