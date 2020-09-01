const utilsHelper = require("../helpers/utils.helper")
const Review = require("../models/review")
const reviewController = {}

reviewController.getReview = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const blogId= req.params.id;

        const totalReviews = await Review.countDocuments();
        const totalPages = Math.ceil(totalReviews / limit);

        const offset = limit * (page - 1);

        const review = await Review.find({blog: blogId})
            .sort({ createAt: -1 })
            .skip(offset)           //offset: ????
            .limit(limit);

        return utilsHelper.sendResponse(
            res,
            200,
            true,
            { review, totalPages },      //co the doi ten mac dinh:blog va totalpage <=> { tienBlogs:blogs, tienTotalPage:totalPages }
            null,
            "Load Reviews sucessfully"
        )

    } catch (error) {
        next(error)
    }
}

reviewController.createReview = async (req, res, next) => {
    try {
        const userId = req.userId;
        const blogId = req.params.id;
        const { content } = req.body;

        const review = await Review.create({
            user: userId,
            blog: blogId,
            content

        })
        return utilsHelper.sendResponse(
            res,
            200,
            true,       //sucess: true
            review,       //data
            null,
            "Create new review succesfully"
        )

    } catch (error) {
        next(error)
    }
}

reviewController.updateReview = async (req, res, next) => {
    try {
        const userId = req.userId;
        const reviewId= req.params.id;
        
        const { content } = req.body;

        const review = await Review.findOneAndUpdate(
            {_id: reviewId, user: userId},
            {content},
            {new: true},
         )

        if(!review) return next(new Error("Review not found or user s not author"));
             
        return utilsHelper.sendResponse(
            res,
            200,
            true,       //sucess: true
            review,       //data: blog
            null,
            "Update Review successfully"
        )

    } catch (error) {
        next(error)
    }
}
reviewController.deleteReview = async (req, res, next) => {
    try {
        const userId = req.userId;
        const reviewId= req.params.id;
        
        
        // hide the blog,, nto actualy delete
        const review = await Review.findOneAndDelete(
            {
            _id: reviewId,
            user: userId,
            },
                  
            //^ return the updated blog, check for doc of this
         )

        if(!review) return next(new Error("Review not found or user s not author"));
             
        return utilsHelper.sendResponse(
            res,
            200,        
            true,       //sucess: true
            null,       //hide blog
            null,
            "Delete review successfully"
        )
    } catch (error) {
        next(error)
    }
}






module.exports = reviewController;