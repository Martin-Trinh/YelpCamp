const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/CatchAsync')
const ExpressError = require('../utils/ExpressError')

// model
const Campground = require('../models/campground')
// validation
const {campgroundSchema} = require('../schemas')

const validateCampground = (req, res, next) =>{
    
    const {error}= campgroundSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

router.get('/',catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
}))

router.get('/new', async (req, res) =>{
    res.render('campgrounds/new')
})

router.post('/',validateCampground, catchAsync(async (req, res) =>{
    
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id',catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews')
    if (!camp){
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/detail', {camp})
}))

router.get('/edit/:id', catchAsync(async(req, res) =>{
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp})
}))

router.put('/:id', validateCampground,catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    if (!campground){
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',catchAsync(async (req, res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}))

module.exports = router