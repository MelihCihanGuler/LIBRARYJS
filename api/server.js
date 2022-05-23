const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")
const BookStore = require("./models/BookModel")

const app = express()
app.use(bodyParser.json())
app.use(cors())


mongoose.connect("mongodb+srv://melihcihanguler:test112233@librarycluster.n9fj2.mongodb.net/?retryWrites=true&w=majority").then(() =>{
    console.log("DB CONNECTION SUCCESSFUL")
})

app.post('/newbook', async (req, res) => {
    try {
        const newBook = new BookStore({
            bookName: req.body.bookName,
            author: req.body.author,
            quantity: req.body.quantity,
            department: req.body.department,
            comments: req.body.comments
        })
        const book = await newBook.save()
        res.status(200).json()  
    } catch (err) {
        console.log(err)
    }
})


app.get('/books', async(req, res) => {
    BookStore.find().then(books => res.json(books))
})

app.put('/delete/:id', async(req, res) => {
    console.log(`The book with id ${req.params.id} came to delete`)
    await BookStore.findByIdAndDelete({_id: req.params.id}), (err) =>{
        if(!err){
            console.log("book deleted")
        }else{
            console.log(err)
        }
    }
    res.status(200)
})

app.put('/lend/:id', async(req, res) => {
    try {
        await BookStore.findByIdAndUpdate(req.params.id, {$inc: {quantity: -1}})
    } catch (error) {
        console.log(error)
    }
    res.status(200)  
})

app.put('/back/:id', async(req, res) => {
    try {
        await BookStore.findByIdAndUpdate(req.params.id, {$inc: {quantity: 1}})
    } catch (error) {
        console.log(error)
    }
    res.status(200)
})

app.listen(5000, () => {
    console.log("Server çalıştı")
})