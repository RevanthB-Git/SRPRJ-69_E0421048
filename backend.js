var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('html'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/productivityTracker',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Database connection is successful"))

app.post("/entry",(req,res)=>{
    var userID = req.body.userID;
    var taskName= req.body.taskName;
    var taskDesc = req.body.taskDesc;
    var date = req.body.date;
    var time = req.body.time;

    var data = {
        "userID" : userID,
        "taskName": taskName,
        "taskDesc" : taskDesc,
        "date" : date,
        "time" : time,
    }

    db.collection('taskEntry').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    return res.redirect('prodSummary.html')
})

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('taskEntry.html');
}).listen(3000);

console.log("Server running on PORT 3000");