var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.send({status:'ok', data:"Hello World!"});
// });

// user Api
const userApi = require('./userApi')
router.use ('/users', userApi);

// auth Api
const authApi = require('./authApi')
router.use ('/auth', authApi);

// blog Api
const blogApi = require('./blogApi')
router.use ('/blogs', blogApi);

// review Api
const reviewApi = require('./reviewApi')
router.use ('/reviews', reviewApi);

// reaction Api
const reactionApi = require('./reactionApi')
router.use ('/reactions', reactionApi);

//friend ship api
const friendsApi = require('./friendsApi')
router.use ('/friends', friendsApi)

module.exports = router;
