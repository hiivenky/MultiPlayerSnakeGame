const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')
var cookieParser = require('cookie-parser');
const app = express();

var pairs = [];

var waitingPairId=-1;
var count=0;

function getFood(){
    var x = Math.floor(Math.random()*(999-0));
    var y = Math.floor(Math.random()*(570-0));
    x=Math.floor(x/10)
    y=Math.floor(y/10)
    x=x*10;
    y=y*10;
    var food = {
        'x':x,
        'y':y
    }
    return food;
}

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('client'))

app.get("/",function(req,res){
    res.sendFile(__dirname+'/client/gamePage.html');
});

app.post("/",function(req,res){
    var cookieName = "";

    if(waitingPairId==-1){
        cookieName = cookieName+req.body.playerName+count;
        p = {};
        p[cookieName] = {"x":10,"y":10};
        waitingPairId = count;
        pairs[count]=p;
        console.log(pairs[count]);    
    }else{
        cookieName = cookieName+req.body.playerName+count;
        pairs[waitingPairId][cookieName] = {"x":10,"y":10};
        pairs[waitingPairId]["food"]=getFood();
        console.log(pairs[0])
        count=count+1;
        waitingPairId=-1;
    }
    res.cookie("name",cookieName).redirect("/homePage");
})


app.get("/homePage",function(req,res){
    var name = String(req.cookies["name"]);
    res.sendFile(__dirname+'/client/snakeGame.html');
})


app.post("/update",function(req,res){
    
    var name = String(req.cookies["name"]);
    var id = name[name.length-1];
    var pair = pairs[id];
    pair[req.cookies["name"]] = {"x":req.body.x,"y":req.body.y};
    pairs[id] = pair;
    var data = {};
    for(var attributeName in pair){
        if(attributeName!==req.cookies["name"]&&attributeName!=="food"){
            data["enemy"] = pair[attributeName]; 
        }
    }
    data.food = pair["food"]
    res.send(JSON.stringify(data)); 
})

app.get("/getFood",function(req,res){
    var name = String(req.cookies["name"]);
    var id = name[name.length-1];
    var pair = pairs[id];
    pair["food"] = getFood();
    pairs[id] = pair;
    res.send(JSON.stringify(pair.food));
})

app.listen(3000,function(){
    console.log("Server has started on port number 3000");    
})

