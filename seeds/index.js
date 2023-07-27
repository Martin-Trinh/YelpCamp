const mongoose = require('mongoose')
// model 
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelper')

mongoose.connect('mongodb://mongo:27017/yelp-camp')
.then(() => console.log('Database connected'))
.catch(e => {
    console.log('Cannot connect to db')
    console.log(e)
})

function randomPicker(array) {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDb = async () => {
    await Campground.deleteMany({})
    for( let i = 0; i < 50; i++){
        const index = Math.floor(Math.random() *1000)
        const camp = await new Campground({
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${randomPicker(descriptors)} ${randomPicker(places)}`
        })
        await camp  .save()
    }
}
seedDb()