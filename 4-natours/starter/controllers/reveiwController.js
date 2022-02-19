

const Review = require('../Models/reviewModel')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const ApiFeatures = require('../utils/apiFeatures')
const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher')


exports.getReviews= asyncErrorCatcher(async (req,res,next)=>{
     const ReviewsQueryObject = new ApiFeatures(Review.find(),req.query)
                                                                    .filter()
                                                                    .sort()
                                                                    .fieldLimiting()
                                                                    .pagination()
     const ReviewsData = await ReviewsQueryObject
    //send the response 
    res.status(200).json({
        'message':"success",
        'results': ReviewsData.length,
        "data":ReviewsData
    })
}
)

exports.createReview = asyncErrorCatcher(async (req,res,next)=>{
    const review = await Review.create(req.body)
    res.status(201).json({
        "message":"success",
        review   
    })
})

exports.getReview = AsyncErrorCatcher(async (req,res,next)=>{
    const {id} = req.params
    const reviewData = await Review.findById(id)
    res.status(200).json({
        "message":"success",
        reviewData
    })
})