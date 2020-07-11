function init(){
var x_change = 0;
var y_change = 0;
var food_x = 0;
var food_y = 0;
var x_head = 10;
var y_head = 10;
var queue = [];
var enemy = [];
var length = 1;
var enemyLength =0;
var enemy_x_head=-1;
var enemy_x_head=-1;
canvas = $('#myCanvas')
ctx = $(canvas)[0].getContext('2d');
ctx.fillStyle = "#FF0000";
initial();

function initial(){
    snakeMovement();
    ctx.fillStyle = "#FF0000";
    ctx.rect(10,10,10,10);
    queue.push({'x':10,'y':10})
    ctx.fill();
    $('input[value="UP"]').on("click",up);
    $('input[value="DOWN"]').on("click",down);
    $('input[value="LEFT"]').on("click",left);
    $('input[value="RIGHT"]').on("click",right);
    setTimeout(gameCore(),10);
}
function gameCore(){
    x_head = x_head+x_change;
    y_head = y_head+y_change;
    if(!(x_change==0&&y_change==0)){
        queue.push({'x':x_head,'y':y_head})
    }
    $.post("/update",{"x":x_head,"y":y_head},function(res){
        var dataFromServer = JSON.parse(res);
        if(dataFromServer.hasEaten){
            alert("yes u ate");

        }
        if(typeof (dataFromServer.food)!=="undefined"){
            food_x = dataFromServer.food.x;
            food_y = dataFromServer.food.y;
            ctx.fillStyle = "green";
            ctx.fillRect(food_x,food_y,10,10);
        }
        if(typeof (dataFromServer.enemy)!=="undefined"){
            if(enemy.length==0){
                enemy.push(dataFromServer.enemy);
                enemyLength=1;
            }
            else if(enemy.length>=1&&(enemy[enemy.length-1].x!=dataFromServer.enemy.x||enemy[enemy.length-1].y!=dataFromServer.enemy.y)){
                enemy.push(dataFromServer.enemy);
            }
        }
    });
    if(food_x==x_head&&food_y==y_head){
        length = length+1;
        $.get("/getFood",function(res){
            var newFood = JSON.parse(res);
            ctx.fillStyle = "black";
            ctx.fillRect(food_x,food_y,10,10);
            food_x = newFood.x;
            food_y = newfood.y;
            ctx.fillStyle = "green";
            ctx.fillRect(food_x,food_y,10,10);
        });
    }else if(enemy.length>=1&&food_x==enemy[enemy.length-1].x&&food_y==enemy[enemy.length-1].y){
        enemyLength = enemyLength+1;
        $.get("/getFood",function(res){
            var newFood = JSON.parse(res);
            ctx.fillStyle = "black";
            ctx.fillRect(food_x,food_y,10,10);
            food_x = newFood.x;
            food_y = newfood.y;
            ctx.fillStyle = "green";
            ctx.fillRect(food_x,food_y,10,10);
        });
    }
    if(queue.length>length){
        var past = queue[0];
        queue.shift();
        ctx.fillStyle = "black";
        ctx.clearRect(past.x,past.y,10,10);
    }
    if(enemy.length>enemyLength){
        var past = enemy[0];
        enemy.shift();
        ctx.fillStyle = "black";
        ctx.clearRect(past.x,past.y,10,10);
    }
    for(var i=0;i<queue.length;i++){
        var coord = queue[i];
        ctx.fillStyle = "red";
        ctx.fillRect(coord.x,coord.y,10,10)
    }
    for(var i=0;i<enemy.length;i++){
        var coord = enemy[i];
        ctx.fillStyle = "blue";
        ctx.fillRect(coord.x,coord.y,10,10)
    }
    setTimeout(gameCore,100);
}

function snakeMovement(){
    $(document).keydown(function(e){
        if(e.which==37){
            x_change = -10;
            y_change = 0;
        }else if(e.which==38){
            y_change = -10;
            x_change = 0;
        }else if(e.which==39){
            x_change = 10;
            y_change = 0
        }else if(e.which==40){
            y_change = 10
            x_change = 0
        }else{
        } 
    })
}
function up(){
    y_change = -10;
    x_change = 0;       
}
function down(){
    y_change=10;
    x_change=0
}
function left(){
    y_change=0;
    x_change=-10;
}
function right(){
    y_change=0;
    x_change=10;
}
}
