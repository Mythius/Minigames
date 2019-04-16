function obj(id){return document.getElementById(id);}
function hide(id){obj(id).style.visibility='hidden';}
function show(id){obj(id).style.visibility=null;}
var game=obj('game'),playing=true,wait=false;
game.focus();
hide('arrows');
function random(min,max){return Math.floor(min+Math.random()*(max-min));}
var colors=['red','blue','yellow','purple','green','orange','#faf','#faf','green','purple'];
var lcode;
function loadLevel(r){
    if(r=='no'){
        var code=lcode?lcode:prompt('Enter Level Code:');
        if(code.indexOf('.')!=-1){
            getdim(code);
            for(var i=0;i<total;i++){
                var tile=document.createElement('div');
                var c=colors[code[i]];
                tile.style.backgroundColor=c;
                game.appendChild(tile);
                tile.classList.add('tile');
            }
        } else {
            alert('invalid level code: commencing to randomly generate'); 
            loadLevel('yes');
        }
    } else if(r=='blank') {
        updim(prompt('width'),prompt('height'));
        for(var i=0;i<total;i++){
        var tile=document.createElement('div');
        var c='green';
        tile.style.backgroundColor=c;
        game.appendChild(tile);
        tile.classList.add('tile');
        }

    } else {
        updim(prompt('width'),prompt('height'));
        for(var a=0;a<width;a++){
            for(var b=0;b<height;b++){
                var tile=document.createElement('div');
                var c=colors[random(0,colors.length)];
                tile.style.backgroundColor=c;
                 game.appendChild(tile);
                tile.classList.add('tile');
            }
        }
    }
}
function updim(w,h){
    width=w;
    height=h;
    total=width*height;
    game.style.width=width*50+'px'; 
}
function getdim(c){
    var a=c.indexOf(',');
    var b=c.indexOf('.');
    updim(Number(c.substr(a+1,b-a-1)),Number(c.substr(b+1,c.length-1)));
}
if(location.href.indexOf('?')!=-1){
lcode=location.href.split('?')[1];
loadLevel('no');
}else{
loadLevel(prompt('Randomly Generate'));
}
show('player');
show('game');
show('arrows');
var tiles=document.getElementsByTagName('div'),grid=[],iRequest=[];
function update(){
    grid=[];
    for(var i=2;i<tiles.length;i++){
        grid.push(tiles[i].style.backgroundColor);
    }
}
update();
var xp=5, yp=5, x=1,y=1,player=obj('player'),flavor='blank';
var key={up: 38,down: 40, left: 37, right: 39,space: 32,e: 69};
document.addEventListener('keydown',function(ev){
    var handled = false;
    switch(ev.keyCode){
        case key.up: rMove(0,-1); handled=true; break;
        case key.down: rMove(0,1); handled=true; break;
        case key.left: rMove(-1,0); handled=true; break;
        case key.right: rMove(1,0); handled=true; break;
        case key.space: location.reload(); break;
        case key.e: deliver(); break;
    }
    if(handled){
        ev.preventDefault();
    }
});
buttons();
function buttons(){
    obj('a').addEventListener('click',function(){rMove(-1,0)});
    obj('b').addEventListener('click',function(){rMove(0,-1)});
    obj('c').addEventListener('click',function(){rMove(0,1)});
    obj('d').addEventListener('click',function(){rMove(1,0)});
    obj('r').addEventListener('click',function(){location.reload();});
}
function rMove(dx,dy){
    if(playing&&(!wait)){
        addReq(x+dx,y+dy,true);
        switch(iRequest.last()){
            case 'rgb(255, 170, 255)': move(dx,dy); break;
            case 'green': move(dx,dy); break;
            case 'yellow': move(dx,dy);wait=true; setTimeout(function(){wait=false;rMove(-dx,-dy);},300); break;
            case 'orange': move(dx,dy); flavor='orange'; break;
            case 'purple': move(dx,dy); flavor='lemon'; rMove(dx,dy); break;
            case 'blue': if(flavor=='orange'||waterDetect(x+dx,y+dy)){move(dx,dy);wait=true;setTimeout(function(){wait=false;rMove(-dx,-dy);},300);}else{move(dx,dy);} break;
            case 'out': break;
            default: break;   
        }
    }
}
function addReq(x,y,player){
    iRequest.push(grid[pos(x,y)]);
    if(player&&x>width){gameWin();return;}
    if(x<1||y>height+1||y<1||x>width){
        iRequest.push('out');
        return 'out';
    } else {
        return grid[pos(x,y)];
    }
}
function pos(x,y){
    return y*width-width-1+x;   
}
Array.prototype.last = function(){
    return this[this.length-1];
};
Array.prototype.empty = function(){
    var l=this.length;
    for(var a=0;a<l;a++){
        this.pop();  
    }
};
Array.prototype.contains = function(s){
    return this.indexOf(s)!=-1;   
};
function move(cx,cy){
    x+=cx;
    y+=cy;
    xp+=cx*50;
    yp+=cy*50;
    player.style.left=xp+'px';
    player.style.top=yp+'px';
}
function waterDetect(x,y){
    iRequest=[];
    addReq(x-1,y,false);
    addReq(x+1,y,false);
    addReq(x,y-1,false);
    addReq(x,y+1,false);
    return iRequest.contains('yellow');
}
function gameWin(){
    playing=false;
    var l=tiles.length;
    for(var t=1;t<l;t++){
        if(tiles[2]){
            tiles[2].parentNode.removeChild(tiles[2]);
        }
    }
    hide('game');
    hide('player');
    hide('download');
    var win = document.createElement('img');
    win.src='level_complete.png';
    win.alt='Level Complete';
    win.style.display='block';
    win.style.margin='auto';
    var a=document.createElement('a');
    a.innerText='Home';
    a.href='index.html';
    a.style.float='left';
    a.style.color='white';
    document.body.appendChild(a);
    document.body.appendChild(win);
}
if(addReq(1,1)=='orange'){flavor='orange';}
var ct=document.getElementsByClassName('tile');
var a=0;
function addButtons(){
    for(var i=0;i<ct.length;i++){
        ct[i].addEventListener('click',function(){
            var thing=this;
            var box=document.createElement('box');
            for(let j=0;j<7;j++){
                var e=document.createElement('col');
                e.style.backgroundColor=colors[j];
                e.addEventListener('click',function(e){
                    thing.style.backgroundColor=this.style.backgroundColor;
                    update();
                    this.parentElement.remove();
                });
                box.appendChild(e);
            }
            game.appendChild(box);
            box.style.left=thing.offsetLeft+'px';
            box.style.top=thing.offsetTop+'px';
        });
    }
}
function remBox(){
    var a=document.getElementByTagName('box');
    for(var k in a){
        a[k].remove();   
    }
}
addButtons();
function deliver(){
    var c='';
    for(var i=2;i<tiles.length-1;i++){
        var co=tiles[i].style.backgroundColor;
        if(co=='rgb(255, 170, 255)'){co='#faf';}
        c+=colors.indexOf(co);
    }
    return c+','+width+'.'+height;
}
function download(filename,text){
    var e=document.createElement('a');
    e.href='data:text/plain;charset=utf-8,'+encodeURIComponent(text);
    e.download=filename;
    e.style.display='none';
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
}
obj('download').addEventListener('click',function(){
    download('New-Level.myt',deliver());
});