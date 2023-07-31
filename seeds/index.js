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
        const randomPrice = Math.floor(Math.random() * 30) + 10
        const camp = await new Campground({
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${randomPicker(descriptors)} ${randomPicker(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil voluptatibus vitae cum similique harum placeat earum vero doloribus, dolorem doloremque, iusto natus dolore sequi atque. Error amet quo at nihil.',
            price: randomPrice
        })
        await camp.save()
    }
}
seedDb().then(() => {
    mongoose.connection.close()
})