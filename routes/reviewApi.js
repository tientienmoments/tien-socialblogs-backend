const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const validators = require("../middlewares/validators")
const authMiddleware = require("../middlewares/authentication")
const { param, body } = require("express-validator")

/**
 * @route GET api/review/blogs/:id
 * @description Get review 
 * @access Public
 */
router.get(
    "/blogs/:id",
    // authMiddleware.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ]), //check param is blog id or not
    reviewController.getReview
);

/**
 * @route POST api/blogs
 * @description create new review
 * @access Public
 */

router.post(
    "/blogs/:id",
    authMiddleware.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
        body("content", "missing content").exists().notEmpty(),
    ]),
    reviewController.createReview
)




/**
 * @route PUT api/review/:ID
 * @description REQUIRE LOGIN n UUPDATE review
 * @access Public
 */

router.put(
    "/:id",
    authMiddleware.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),

        body("content", "missing content").exists().notEmpty(),
    ]),
    reviewController.updateReview
)

/**
 * @route DELETE api/review/:ID
 * @description REQUIRE LOGIN n delete review
 * @access Public
 */

router.delete(
    "/:id",
    authMiddleware.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),

    ]),
    reviewController.deleteReview
)





module.exports = router;