//*********Classes*********//

var Snake = function(x,y,color,controls){ 
    //@param starting x, starting y, color (must have a dark color) and array of controls (using keycodes)
    var array=[{x:x,y:y}];
    var xPos=x,yPos=y;
    var kx=0,ky=0;
    var pkx=0,pky=0;
    var length=1;
    var next='darkgray';
    var c=color;
    var dead=false;
    var isAI=false;
    this.update=function(){ //method used to update and draw 
        if(!dead){
            if(!isAI){
                pkx=kx;
                pky=ky;
            } else {
                if(next=='out'){
                    if(pkx==0){
                        pkx=1;
                        pky=0;
                    } else {
                        pky=-1;
                        pkx=0;
                    }
                }
            }
            if(isInBounds(xPos+pkx,yPos+pky)){
                xPos+=pkx;
                yPos+=pky;
                //****************
                //      array is the coordinates of each section of the snake.
                //      everytime it moves it adds that coordinate to the beggining of the array.
                //      removes last element until array matches logic variable 'length'.
                //****************
                array.unshift({x:xPos,y:yPos});
                while(array.length>length) array.pop();
                if(iRequest(xPos,yPos)=='purple'){
                    length++;
                    newFruit();
                }
                if(iRequest(xPos,yPos)=='yellow'){
                    length*=2; //doubles length of snake
                    newFruit();
                }
                var r=iRequest(xPos,yPos);
            if(r=='darkgray'||r=='purple'||r=='yellow'){}else{die();}
                draw();
            if(iRequest(xPos,yPos)!='dark'+c) die();
            } else {
                die();   
            }
        }
    };
    function die(){
        dead=true;
    }
    function draw(){
        if(!dead){
            if(playing){
                setColor(xPos,yPos,'dark'+c);
                for(let i=1;i<array.length;i++){
                    var t=iRequest(array[i].x,array[i].y);
                    for(let i=0;i<snakes.length;i++){
                        if(snakes[i].getColor()==t){
                            snakes[i].kill();   
                        }
                    }
                    setColor(array[i].x,array[i].y,color);
                }
            }
        }
    }
    this.getNext=function(){ // used to detect block in front of snake. **Buggy**
            next=iRequest(xPos+kx,yPos+ky);
            if(next=='darkgray'||next=='purple'||next=='yellow'||next=='dark'){}else{die();};
       	}
    this.nValue=function(){
        return next;   
    }
    this.kill=function(){
        dead=true;   
    }
    if(typeof controls == 'boolean'){
        isAI=true;
    } else {
        document.addEventListener('keydown',function(e){ // Sets up controls array must be up,left,down,right
            if(!dead){
                switch(e.keyCode){
                    //prevents moving backwards. and more than once in a single tick.
                    case controls[0]: if(pky!=1){ky=-1;kx=0;} break;
                    case controls[1]: if(pkx!=1){kx=-1;ky=0;} break;
                    case controls[2]: if(pky!=-1){ky=1;kx=0;} break;
                    case controls[3]: if(pkx!=-1){kx=1;ky=0;} break;
                }
            }
        });
    }
    this.position=function(){
        return array[0];   
    }
    this.direction=function(){
        return pkx+' '+pky; 
    }
    this.isDead=function(){
        return dead;   
    }
    this.getColor=function(){
        return c;   
    }
    this.addLength=function(l){
        length+=l;
    }
}

//*********Functions********//
function obj(id){return document.querySelector(id);}

function random(min,max){
    return Math.floor(min+Math.random()*(max-min+1));
}

function pos(x,y){ //returns position as if array board was 2 dimensional.
    if(isInBounds(x,y)){
        return y*width-width-1+x;
    } else {
        return 'out';   
    }
}

function setupBoard(){
    obj('game').style.width=20*width+'px';
    for(let i=0;i<width*height;i++){
        var e=document.createElement('tile');
        e.style.backgroundColor='darkgray';
        obj('game').appendChild(e);
    }
}

function iRequest(x,y){ //returns color at any position in board array (actuall displayed board)
    if(isInBounds(x,y)){
        return board[pos(x,y)].style.backgroundColor;
    } else {
        return 'out';   
    }
}

function setColor(x,y,c){ //sets color at any x,y position 
    board[pos(x,y)].style.backgroundColor=c;
}

function clearBoard(c){ //clears board and sets to @param color
    for(let i=0;i<board.length;i++){
        board[i].style.backgroundColor=c;   
    }
}

function isInBounds(x,y){ // detects if coordinates are within boundries
    return (x>0&&x<=width&&y>0&&y<=height);
}

function addControls(){ //adds overall key function not specific to any snake.
    document.addEventListener('keydown',function(e){
        switch(e.keyCode){
            case key.esc: end(); break;
            case 32: restart();
        }
    });   
}

function drawFruit(){ //draws a single fruit
    setColor(fx,fy,fc);
}

function newFruit(){ //makes a new logical fruit with a 1/7 chance of being yellow
    fc=(random(1,7)==3)?'yellow':'purple';
    fx=random(1,width);
    fy=random(1,height);
    if(iRequest(fx,fy)!='darkgray'){
        newFruit();  
    }
    
}

function animationLoop(){ //main loop of game repeats until game is over
    if(playing){
        clearBoard('darkgray');
        drawFruit();
        for(let i=0;i<snakes.length;i++){
            snakes[i].getNext();   
        }
        var amountAlive=0;
        for(let i=0;i<snakes.length;i++){
            snakes[i].update();
            amountAlive+=snakes[i].isDead()?0:1;
        }
        if(amountAlive==0){
            end();   
        } else if(amountAlive==1){
            win();   
        }
    }
    if(playing){
        setTimeout(function(){requestAnimationFrame(animationLoop);},90); 
        //interval (in milisecond) between each  tick of the game currently set to 70ms
    }
}

function end(){ //game over both players lose
    if(playing){
        var i=169;
        var j=170;
        clearBoard('darkred');
    }
    playing=false;
}

function restart(){ // restart function (empty)
    snakes=[
        new Snake(20,10,'blue',[key.up,key.left,key.down,key.right]),
        new Snake(10,10,'red',[key.w,key.a,key.s,key.d]),
        new Snake(10,20,'orange',[73,74,75,76]),
        new Snake(20,20,'green',[101,97,98,99])
    ];
    clearBoard('darkgray');
    playing=true;
    newFruit();
    animationLoop();
    setTimeout(function(){
        for(let i=0;i<snakes.length;i++){
            snakes[i].addLength(1);
        }
    },5000);
    while(snakes.length>a) snakes.pop()
}

function win(){ //shows which player wins; stops game
    for(let i=0;i<snakes.length;i++){
        if(!snakes[i].isDead()){
            alert(snakes[i].getColor()+' snake Wins!');
        }
    }
    playing=false;
}

//********Global Variables********//

var width=30,height=30;
var board=[];
var key={w:87,a:65,s:83,d:68,esc:27,r:82,space:32,left:37,right:39,up:38,down:40};
var fx,fy,fc;
var playing=true;
var snakes=[
    new Snake(20,10,'blue',[key.up,key.left,key.down,key.right]),
    new Snake(10,10,'red',[key.w,key.a,key.s,key.d]),
    new Snake(10,20,'orange',[73,74,75,76]),
    new Snake(20,20,'green',[101,97,98,99])
];
var a=prompt('Amount of Players');
while(snakes.length>a) snakes.pop()
//*************Running the Actual Game************//
setupBoard();
addControls();
board=document.getElementsByTagName('tile');
newFruit();
animationLoop();
setTimeout(function(){
    for(let i=0;i<snakes.length;i++){
        snakes[i].addLength(1);
    }
},5000);