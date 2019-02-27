function obj(id){return document.querySelector(id);}
function setup(){
    for(let i=0;i<64;i++){
        var t=document.createElement('div');
        t.classList.add('tile');
        game.appendChild(t);
    }
    setColor(4,4,'w');
    setColor(4,5,'b');
    setColor(5,4,'b');
    setColor(5,5,'w');
}
function pos(x,y){
    return y*8-9+x;
}
function iReq(x,y){
    if(outofBounds(x,y)){
        return tile[pos(x,y)];
    } else {
        return 'out';
    }
}
function setColor(x,y,c){
    if(outofBounds(x,y)){
        var t=iReq(x,y);
        if(c=='none'){
            if(typeof t != 'string'){
                t.classList.remove('w');
                t.classList.remove('b');
            }
        } else {
            t.classList.remove('w');
            t.classList.remove('b');
            t.classList.add(c);
        }
        return true;
    } else return false;
}
function getColor(x,y){
    if(outofBounds(x,y)){
        if(iReq(x,y).classList.contains('w')){
            iRequest.push('w');
            return 'w';
        } else if(iReq(x,y).classList.contains('b')){
            iRequest.push('b');
            return 'b';
        } else {
            iRequest.push('none');
            return 'none';
        }
    }
    iRequest.push('none');
    return 'none';
}
Array.prototype.contains = function(s){
    return this.indexOf(s)!=-1;  
};
Array.prototype.last = function(){
    return this[this.length-1];   
};
Array.prototype.amountOf = function(s){
    if(this.contains(s)){
        var a=0;
        for(var i=0;i<this.length;i++){
            if(this[i]===s){
                a++;   
            }
        }
        return a;
    } else {
        return -1;   
    }
};
Array.prototype.trim=function(s){
    var l=this.length;
    for(var i=iRequest.indexOf(s)+1;i<l;i++){
        this.pop(); 
    }
};

function addEvents(){
    document.addEventListener('mousemove',function(e){
        var x=e.clientX-game.offsetLeft;
        var y=e.clientY-game.offsetTop;
        mx=Math.ceil(x/40);
        my=Math.ceil(y/40);
    });
    document.addEventListener('mousedown',function(){
        if(outofBounds(mx,my)){
            if(valid(mx,my)){
                if(reqAll(mx,my)){
                    flipAll(mx,my);
                    turn=(turn+1)%2
                    turns++;
                    obj('#turn').innerHTML=!turn?'Black Turn':'White Turn';
                    if(turns==60){
                        getWinner();
                    }
                }
            }
        }
    });
    obj('#pass').addEventListener('click',pass);
    obj('#end').addEventListener('click',function(){console.log(getWinner());});
}
function outofBounds(x,y){
    return x>0&&x<=8&&y>0&&y<=8;
}
function valid(x,y){
    return getColor(x,y)=='none';   
}
function flipAll(x,y){
    setColor(x,y,turn?'w':'b');
    flipDir(x,y,1,0);
    flipDir(x,y,-1,0);
    flipDir(x,y,1,1);
    flipDir(x,y,-1,1);
    flipDir(x,y,0,1);
    flipDir(x,y,1,-1);
    flipDir(x,y,-1,-1);
    flipDir(x,y,0,-1);
}
function flipDir(x,y,cx,cy){
    iRequest=[];
    if(reqDir(x,y,cx,cy)){
        if(iRequest.last()==(turn?'w':'b')){
            iRequest.trim(turn?'w':'b');
            for(var i=1;i<iRequest.length;i++){
                setColor(x+cx*i,y+cy*i,turn?'w':'b');
            }
        }
    }
}
function reqDir(x,y,cx,cy){
    iRequest=[];
    var i=1;
    while(iRequest.last()!='none'){
        getColor(x+cx*i,y+cy*i);
        i++;
    }
    iRequest.pop();
    var between=false;
    var end=false;
    iRequest.trim(turn?'w':'b');
    between=(iRequest[0]==(turn?'b':'w'));
    end=(iRequest[0]==(turn?'b':'w'));
    return end&&between;
}
function reqAll(x,y){
    possible=[];
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            possible.push(reqDir(x,y,i,j));
        }
    }
    return possible.contains(true);
}
function pass(){
    if(turns<60){
        if(!hasMovesLeft()){
            turn=(turn+1)%2;
            obj('#turn').innerHTML=!turn?'Black Turn':'White Turn';
        } else {
            alert('You can\'t pass until you have no moves left!');
        }
    } else {
        getWinner();   
    }
}
function hasMovesLeft(){
    var p=[];
    for(var i=1;i<8;i++){
        for(var j=1;j<8;j++){
            if(getColor(i,j)=='none'){
                p.push(reqAll(i,j));
            }
        }
    }
    return p.contains(true);
}
function getWinner(){
    var w=0;
    var b=0;
    for(let i=0;i<64;i++){
        if(tile[i].classList.contains('w')){
            w++;
        } else if(tile[i].classList.contains('b')) {
            b++;   
        }
    }
    if(w>b){
        alert('White wins!');   
    } else if(w<b){
        alert('Black wins!');   
    } else {
        alert('No one wins!');   
    }
    return {black:b,white:w};
}
var game=obj('#game');
var tile=document.getElementsByClassName('tile');
var iRequest=[],possible=[];
var turn=0;
var mx,my;
var turns=0;
setup();
addEvents();