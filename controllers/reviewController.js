const {catchAsync, sendResponse, AppError} = require("../helpers/utils.helper")
const Review = require("../models/review")
const reviewController = {}

reviewController.getReview = catchAsync(async (req, res, next) => {
    
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

        return sendResponse(
            res,
            200,
            true,
            { review, totalPages },      //co the doi ten mac dinh:blog va totalpage <=> { tienBlogs:blogs, tienTotalPage:totalPages }
            null,
            "Load Reviews sucessfully"
        )

    
})

reviewController.createReview = catchAsync(async (req, res, next) => {

        const userId = req.userId;
        const blogId = req.params.id;
        const { content } = req.body;

        const review = await Review.create({
            user: userId,
            blog: blogId,
            content

        })
        return sendResponse(
            res,
            200,
            true,       //sucess: true
            review,       //data
            null,
            "Create new review succesfully"
        )

    
})

reviewController.updateReview = catchAsync(async (req, res, next) => {

        const userId = req.userId;
        const reviewId= req.params.id;
        
        const { content } = req.body;

        const review = await Review.findOneAndUpdate(
            {_id: reviewId, user: userId},
            {content},
            {new: true},
         )

        if(!review) return next(new Error("Review not found or user s not author"));
             
        return sendResponse(
            res,
            200,
            true,       //sucess: true
            review,       //data: blog
            null,
            "Update Review successfully"
        )

    
})
reviewController.deleteReview = catchAsync(async (req, res, next) => {
    
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
             
        return sendResponse(
            res,
            200,        
            true,       //sucess: true
            null,       //hide blog
            null,
            "Delete review successfully"
        )

})






module.exports = reviewController;