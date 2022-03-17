

const Review = require('../Models/reviewModel')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const ControllerFactory = require('./ControllerFactory')


exports.setBody = asyncErrorCatcher(
    async(req,res,next)=>{
            if(!req.body.tour)req.body.tour= req.params.tourid;
            if(!req.body.user)req.body.user= req.user.id
            next()
    }
)



exports.getReviews= ControllerFactory.getAll(Review)
exports.createReview =ControllerFactory.createOne(Review)
exports.getReview = ControllerFactory.getOne(Review)
exports.updateReview = ControllerFactory.updateOne(Review)
exports.deleteReview = ControllerFactory.deleteOne(Review)

