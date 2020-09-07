const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/users
 * @description Register new user
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);
//  FOR TESTING SENDING EMAIL
// GET localhost:5000/api/users/sendtestemail
// router.get("/sendtestemail",
//   // authMiddleware.loginRequired,
//   function (req, res, next) {
//     const KEY = process.env.MAILGUN_API
//     const DOMAIN = process.env.MAILGUN_DOMAIN
//     var mailgun = require('mailgun-js')({apiKey: KEY, domain: DOMAIN});
//     const content = name => `Hello ${name}`
//     const data = {
//       from: 'Catalina with Love <khoa@damanhkhoa.com>',
//       to: ["khoa@coderschool.vn", "khoa@yopmail.com", "marc@yopmail.com"],
//       subject: 'Hello',
//       html: content("khoa")
//     };

//     mailgun.messages().send(data, (error, body) => {
//       console.log(body);
//     });
//     res.send("OK")
//   }
// )

// curl -s --user 'api:7cd1ac2b-a5b13a8e 
// ' \
// 	https://api.mailgun.net/v3/yopmail.com/messages \
// 	-F from='Excited User <mailgun@yopmail.com>' \
// 	-F to=YOU@YOUR_DOMAIN_NAME \
// 	-F to=bar@example.com \
// 	-F subject='Hello' \
// 	-F text='Testing some Mailgun awesomeness!'

router.get("/forget/:email",
  userController.forgetPassword
)

router.put("/reset-password",
  userController.resetPassword
)


router.put("/me",
  authMiddleware.loginRequired,
  userController.updateProfile
)

router.get("/me",
  authMiddleware.loginRequired,
  userController.getCurrentUser
)
router.post("/me/avatar",
authMiddleware.loginRequired,
userController.uploadAvatar
)


module.exports = router;