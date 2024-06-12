if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require("express")
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')

// routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')

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
app.use(mongoSanitize());
const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        HttpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

app.use((req, res, next) =>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/makeUser', async (req ,res) =>{
    const user =  new User ({email: 'colt@gmail.com', username: 'Colt'})
    const newUser  = await User.register(user, 'THis is my pass')
    res.send(newUser)
})


app.use('/', userRoutes)
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