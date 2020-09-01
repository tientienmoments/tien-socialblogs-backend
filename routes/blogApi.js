const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const validators = require("../middlewares/validators")
const authMiddleware = require("../middlewares/authentication")
const { param, body } = require("express-validator")



/**
 * @route GET api/blogs?page=1&limit=10
 * @description Get blog with pagination
 * @access Public
 */
router.get(
    "/",
    // authMiddleware.loginRequired,
    blogController.getBlogs
);

router.get(
    "/:id",
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ]),
    blogController.getSingleBlog
);

/**
 * @route POST api/blogs
 * @description REQUIRE LOGIN n creat new blog
 * @access Public
 */

router.post(
    "/",
    authMiddleware.loginRequired,
    validators.validate([
        body("title", "missing title").exists().notEmpty(),
        body("content", "missing content").exists().notEmpty(),
    ]),
    blogController.createBlog
)

/**
 * @route PUT api/blogs/:ID
 * @description REQUIRE LOGIN n UUPDATE BLOG
 * @access Public
 */

router.put(
    "/:id",
    authMiddleware.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
        body("title", "missing title").exists().notEmpty(),
        body("content", "missing content").exists().notEmpty(),
    ]),
    blogController.updateBlog
)

/**
 * @route DELETE api/blogs/:ID
 * @description REQUIRE LOGIN n DELETE BLOG
 * @access Public
 */

router.delete(
    "/:id",
    authMiddleware.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
        
    ]),
    blogController.deleteBlog
)
// ____ make api to review


module.exports = router;