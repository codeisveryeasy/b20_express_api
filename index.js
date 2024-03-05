//import express
let express = require('express')
const { default: mongoose } = require('mongoose')
let tweetsmodel = require('./model/tweets')
let cors = require('cors')

let PORT = 1234

let tweets = [
    {
        "id": 1,
        "post": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "likes": 431,
        "dislikes": 1,
        "username": "MacKegg",
        "profilepic": "https://logo.clearbit.com/google.ru"
    },
    {
        "id": 2,
        "post": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "likes": 964,
        "dislikes": 27,
        "username": "Rawlingson",
        "profilepic": "https://logo.clearbit.com/prnewswire.com"
    }
]

//create express app
let app = express()

//configure express to encode/decode json
app.use(express.json())

//configure cors to accept incoming request from all ip:port
app.use(cors())

//connect to mongodb
let connectionString = "mongodb+srv://mongodbuser:mongodbpassword@cluster0.nezoluq.mongodb.net/tweetscloud"
mongoose.connect(connectionString)
let db = mongoose.connection

//check if db connection is success
db.on("open",()=>{
    console.log("Connected to mongodb in cloud");
})


//create api endpoint
//API URL : http://localhost:1234/
//endpoint is /
//Request method : GET
app.get("/", (request, response) => {
    console.log("endpoint called -> " + request.url + " with method " + request.method)
    //send response
    response.status(200).json({
        "message": "Welcome to rest API with express",
        "method": "GET"
    })
})

//create api endpoint
//API URL : http://localhost:1234/
//endpoint is /
//Request method : POST
app.post("/", (request, response) => {
    console.log("endpoint called -> " + request.url + "with method " + request.method)
    //send response
    response.status(200).json({
        "message": "Welcome to rest API with express",
        "method": "POST"
    })
})

//create api endpoint
//API URL : http://localhost:1234/tweets
//endpoint is /tweets
//Request method : GET

app.get("/tweets",(request, response)=>{
    console.log("endpoint called -> " + request.url + "with method " + request.method)
    response.json(tweets)
})


//get list of all documents from mongodb
app.get("/1.0/tweets/all", (req, res)=>{
    console.log(`Endpoint : ${req.url}, Method: ${req.method}`)
    //interact with mongodb using model file
    tweetsmodel.find({})
                .then(data=>{
                    console.log(`${req.url} success`);
                    //set response status to 200 and 
                    //send data back to client as response
                    res.status(200).json(data)
                })
                .catch(error=>{
                    console.log(`${req.url} failure`);
                    //set response status to 500 and 
                    //send error back to client as response
                    res.status(500).json(error)
                })
})

//add a new tweet
app.post("/1.0/tweets/add",(req, res)=>{
    console.log(`Endpoint : ${req.url}, Method: ${req.method}`)
    //extract request body or request payload
    let requestBody = req.body
    console.log(requestBody)
    //create a new instance of model and 
    //assign requestBody to the new instance
    let tweetsmodelNew = new tweetsmodel(requestBody)
    //save the new instance i..e. tweetsmodelNew to db
    tweetsmodelNew.save()
                .then(data=>{
                    console.log(`${req.url} success`)
                    res.status(200).json(data)
                })
                .catch(error=>{
                    console.log(`${req.url} failure`)
                    res.status(500).json(error)
                })

})

//update tweet
app.put("/1.0/tweets/update/:id", (req, res)=>{
    console.log(`Endpoint : ${req.url}, Method: ${req.method}`)
    //extract request body or request payload
    let requestBody = req.body
    console.log(requestBody)
    //read the id (path parameter)
    console.log(req.params)
    let id = req.params.id
    //find the document with given id and update
    //it with requestbody
    tweetsmodel.findByIdAndUpdate(id, requestBody, {new:true})
                    .then(data=>{
                        console.log(`${req.url} success`)
                        res.status(200).json(data)
                    })
                    .catch(error=>{
                        console.log(`${req.url} failure`)
                        res.status(500).json(error)
                    })

})

//delete tweet from database
app.delete("/1.0/tweets/delete/:id", (req, res)=>{
    console.log(`Endpoint : ${req.url}, Method: ${req.method}`)
    //read the id (path parameter)
    console.log(req.params)
    let id = req.params.id
    //delete tweet with id
    tweetsmodel.findByIdAndDelete(id)
            .then(data=>{
                console.log(`${req.url} success`)
                res.status(200).json(data)
            })
            .catch(error=>{
                console.log(`${req.url} failure`)
                res.status(500).json(error)
    })
})



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
