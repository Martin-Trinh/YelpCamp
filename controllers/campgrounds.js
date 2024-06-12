const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({accessToken: mapboxToken})

module.exports.index = async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
}

module.exports.renderNewForm = async (req, res) =>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(f => ({url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    console.log(campground)
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    .populate({
        path:'reviews',
        populate: {path:'author'}
    }).populate('author')
    if (!camp){
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/detail', {camp})
}

module.exports.renderEditForm = async(req, res) =>{
    const camp = await Campground.findById(req.params.id)
    if(!camp){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {camp})
}

module.exports.editCampground = async (req, res)=>{
    const {id} = req.params
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    if (!campground){
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.image.push(...imgs)
    await campground.save()
    if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){
            await cloudinary.uploader.destroy(filename)

        }
        await campground.updateOne({$pull: {image: {filename: {$in: req.body.deleteImage}}}})
        console.log(campground)
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}