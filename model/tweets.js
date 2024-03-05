//create model
let mongoose = require("mongoose")

//create schema
let tweetSchema = mongoose.Schema

//setup mapping with document
//map the collection in whcih given document is present

//2 parameters
//1. document structure
//2. collection name
let tweetsCollection = new tweetSchema({
    "post":String,
    "likes":Number,
    "dislikes":Number,
    "profilepic":String,
    "postimage":String,
    "comments":Number
}, {
    collection:"tweets"
})

//export
module.exports = mongoose.model("tweetsmodel", tweetsCollection)