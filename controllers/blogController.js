const utilsHelper = require("../helpers/utils.helper")

const Blog = require("../models/blog")
const blogController = {}

blogController.getBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const totalBlogs = await Blog.countDocuments();
        const totalPages = Math.ceil(totalBlogs / limit);

        const offset = limit * (page - 1);

        const blogs = await Blog.find()
            .sort({ createAt: -1 })
            .skip(offset)           //offset: ????
            .limit(limit);

        return utilsHelper.sendResponse(
            res,
            200,
            true,
            { blogs, totalPages },      //co the doi ten mac dinh:blog va totalpage <=> { tienBlogs:blogs, tienTotalPage:totalPages }
            null,
            "Load Blogs sucessfully"
        )
    } catch (error) {
        next(error)
    }
}
blogController.getSingleBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return next(new Error("Blog not found"));

        return utilsHelper.sendResponse(res, 200, true, blog, null, null);
    } catch (error) {
        next(error)
    }
}

blogController.createBlog = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const author = req.userId;
        const blog = await Blog.create({
            title,
            content,
            author,
        })

        return utilsHelper.sendResponse(
            res,
            200,
            true,       //sucess: true
            { blog },       //data: blog
            null,
            "Create new blog succesfully"
        )

    } catch (error) {
        next(error)
    }

}

blogController.updateBlog = async (req, res, next) => {
    try {
        const blogId= req.params.id;
        const author = req.userId;
        const { title, content } = req.body;

        const blog = await Blog.findOneAndUpdate(
            {_id: blogId, author: author},
            {title,content},
            {new: true},
         )

        if(!blog) return next(new Error("Blog not found or user s not author"));
             
        return utilsHelper.sendResponse(
            res,
            200,
            true,       //sucess: true
            { blog },       //data: blog
            null,
            "Update blog successfully"
        )

    } catch (error) {
        next(error)
    }

}

blogController.deleteBlog = async (req, res, next) => {
    try {
        const blogId= req.params.id;
        const author = req.userId;
        
        // hide the blog,, nto actualy delete
        const blog = await Blog.findOneAndUpdate(
            {_id: blogId, author: author},
            {isDeleted: true},
            {new: true},        
            //^ return the updated blog, check for doc of this
         )

        if(!blog) return next(new Error("Blog not found or user s not author"));
             
        return utilsHelper.sendResponse(
            res,
            200,        
            true,       //sucess: true
            null,       //hide blog
            null,
            "Delete blog successfully"
        )

    } catch (error) {
        next(error)
    }

}
module.exports = blogController;