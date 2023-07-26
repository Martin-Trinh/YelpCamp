const express = require("express")
const path = require('path')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://mongo:27017/yelp-camp', {
    userNewParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) =>{
    res.render('home')
})



const port = 3000
app.listen(port , () => console.log(`listening on port ${port}`))