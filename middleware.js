const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas')
const Campground = require('./models/campground')
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) =>{
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash('error', 'You must log in first')
        return res.redirect('/login')
    }
    next()
} 

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) =>{
    
    const {error}= campgroundSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.authorCheck = async (req, res, next) =>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to perform this')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (res, req, next) => {
    const {error} = reviewSchema.validate(req.review)
    if (error){
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) =>{
    const {id ,reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to perform this')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}