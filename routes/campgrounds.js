const express = require('express')
const router = express.Router()

const {isLoggedIn, validateCampground, authorCheck} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/CatchAsync')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('file'),validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn , campgrounds.renderNewForm)

router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(upload.array('file'),validateCampground, authorCheck,catchAsync(campgrounds.editCampground))
.delete(authorCheck ,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, authorCheck, catchAsync(campgrounds.renderEditForm))



module.exports = router