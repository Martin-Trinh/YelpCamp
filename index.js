const express = require("express")
const path = require('path')
const app = express()
const mongoose = require('mongoose')
// model 
const Campground = require('./models/campground')

mongoose.connect('mongodb://mongo:27017/yelp-camp')
.then(() => console.log('Database connected'))
.catch(e => {
    console.log('Cannot connect to db')
    console.log(e)
})




app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/make', async (req, res) => {
    const camp = new Campground({title: 'backyard', description: 'cheap camping'})
    await camp.save()
    res.send(camp)
})

const port = 3000
app.listen(port , () => console.log(`listening on port ${port}`))