const express = require("express")
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
// model 
const Campground = require('./models/campground')

mongoose.connect('mongodb://mongo:27017/yelp-camp')
.then(() => console.log('Database connected'))
.catch(e => {
    console.log('Cannot connect to db')
    console.log(e)
})



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
})

app.get('/campgrounds/new', async (req, res) =>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) =>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    console.log(`This is camp ${camp}`)
    res.render('campgrounds/detail', {camp})
})

app.get('/campgrounds/edit/:id', async(req, res) =>{
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp})
})

app.put('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

const port = 3000
app.listen(port , () => console.log(`listening on port ${port}`))