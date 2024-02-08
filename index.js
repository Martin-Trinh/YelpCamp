const express = require("express")
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')

const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')


// routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

// db connect
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
app.use(express.static(path.join(__dirname, 'public')))

const sesssionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        HttpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sesssionConfig))
app.use(flash())

app.use((req, res, next) =>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) =>{
    res.render('home')
})

app.all('*', (req ,res, next)=>{
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', {err})
})

const port = 3000
app.listen(port , () => console.log(`listening on port ${port}`))