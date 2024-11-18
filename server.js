const dotenv =require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
// const morgan = require('morgan')
const app = express()

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to ${mongoose.connection.name}`);
    
})

app.use(express.urlencoded({extended: false}))
app.use(methodOverride("_method"))
// app.use(morgan('dev'))

const Fruit = require('./models/fruits.js')
// const morgan = require('morgan')

app.get('/fruits/:fruitId/edit', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    res.render('fruits/edit.ejs', {
        fruit: foundFruit
    })
})

app.put('/fruits/:fruitId', async (req, res)=>{
    if (req.body.isReadyToEat === 'on'){
        req.body.isReadyToEat = true
    } else {
        req.body.isReadyToEat = false
    }
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
  res.redirect('/fruits')
})

app.get('/', async (req, res) => {
    res.render('index.ejs')
})

app.delete('/fruits/:fruitId', async (req, res)=> {
    await  Fruit.findByIdAndDelete(req.params.fruitId)
    res.redirect('/fruits')
})

//Get fruits
app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find()
    res.render('fruits/index.ejs', {
        fruits: allFruits
    })
})

app.get('/fruits/new', async (req, res) => {
    res.render ('fruits/new.ejs')
})

app.get('/fruits/:fruitId', async (req, res)=> {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    // res.send(`This route renders the show page for fruit id: ${foundFruit}`)
    res.render('fruits/show.ejs', {
        fruit: foundFruit
    })
})

app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true 
    } else {
        req.body.isReadyToEat = false
    }
    await Fruit.create(req.body)
    // console.log(req.body);
    res.redirect('/fruits')
    
})



app.listen(3000, () => {
    console.log('Listneing on port 3000');
    
})