const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper")
const Blog = require("../models/blog")
const blogController = {}

blogController.getBlogs = catchAsync(async (req, res, next) => {


    // begin filter query
    let filter = { ...req.query }
    delete filter.limit
    delete filter.page
    delete filter.sortBy
    // end

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const totalBlogs = await Blog.find(filter).countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);
    const offset = limit * (page - 1);

    // begin  sorting query
    const { sortBy } = req.query;
    console.log(sortBy)
    // end

    const blogs = await Blog.find(filter)
        .sort(sortBy)
        .skip(offset)
        .limit(limit)
        .populate("author");


    return sendResponse(
        res,
        200,
        true,
        { blogs, totalPages, currentPage: page },
        null,
        ""
    );

});

blogController.getSingleBlog = catchAsync(async (req, res, next) => {

    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new Error("Blog not found"));

    return sendResponse(res, 200, true, blog, null, null);

})

blogController.createBlog = catchAsync(async (req, res, next) => {

    const author = req.userId;

    // remove unallowed fields from body
    const allows = ["title", "content", "tags", "timestamps"];
    for (let key in req.body) {
        if (!allows.includes(key)) {
            delete req.body[key];
        }
    }
    const blog = await Blog.create({
        ...req.body,
        author
    });

    return sendResponse(
        res,
        200,
        true,
        blog,
        null,
        "Create new blog successful"
    );

});

blogController.updateBlog = catchAsync(async (req, res, next) => {

    const blogId = req.params.id;
    const author = req.userId;
    const { title, content } = req.body;

    const blog = await Blog.findOneAndUpdate(
        { _id: blogId, author: author },
        { title, content },
        { new: true },
    )

    if (!blog) return next(new Error("Blog not found or user s not author"));

    return sendResponse(
        res,
        200,
        true,       //sucess: true
        { blog },       //data: blog
        null,
        "Update blog successfully"
    )



})

blogController.deleteBlog = catchAsync(async (req, res, next) => {

    const blogId = req.params.id;
    const author = req.userId;

    // hide the blog,, nto actualy delete
    const blog = await Blog.findOneAndUpdate(
        { _id: blogId, author: author },
        { isDeleted: true },
        { new: true },
        //^ return the updated blog, check for doc of this
    )

    if (!blog) return next(new Error("Blog not found or user s not author"));

    return sendResponse(
        res,
        200,
        true,       //sucess: true
        null,       //hide blog
        null,
        "Delete blog successfully"
    )

})
module.exports = blogController;