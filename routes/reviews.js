const express = require('express')
const router = express.Router({mergeParams: true})

const reviewController = require('../controllers/reviews')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const catchAsync = require('../utils/CatchAsync')



router.post('/', isLoggedIn,validateReview ,catchAsync( reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router