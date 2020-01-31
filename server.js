var express = require('express');

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var dbUrl = "mongodb://127.0.0.1:27017/chat";

var moment = require('moment');

mongoose.connect(dbUrl,(err)=>{
    console.log('mongodb connected',err);
});



var app = express();

var http = require("http").Server(app);


var server = app.listen(3000,()=>{
    console.log('server is runnig','http://localhost:'+server.address().port);
});

var io = require('socket.io').listen(server);

var Message = mongoose.model('Message',{name : String, message : String, time : { type : Date, default: Date.now }});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

// app.use(express.static(path.join(__dirname,'/')));

io.on('connection',socket=>{
    socket.on('chat message',msg=>{
        console.log("message from bishal ",msg);
    })
    
    console.log("a user is connected");

});

// routing

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})


app.get('/messages',(req,res)=>{

    Message.find({},(err,messages)=>{
        res.send(messages)
    });
});

app.post('/messages',(req,res)=>{

    var message = new Message(req.body);
    
    message.save((err) =>{
        if(err)

            sendStatus(500);

        io.emit('message',req.body);
        res.sendStatus(200);
    })
});