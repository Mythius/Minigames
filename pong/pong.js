var player = function(c,x,keys){
    var y=9;
    var ry=0,cy=0,ku=false,kb=false;
    document.on('keydown',function(e){
        switch(e.keyCode){
            case keys[0]: ku=true; break;
            case keys[1]: kb=true; break;
        }
    });
    document.on('keyup',function(e){
        switch(e.keyCode){
            case keys[0]: ku=false; break;
            case keys[1]: kb=false; break;
        }
    });
    this.update=function(){
        if(ku)up();
        if(kb)down();
        cy=ry;
        y+=cy;
        cy=0;
        ry=0;
        display();
    }
    function display(){
        for(let i=0;i<3;i++){
            board.setColor(x,y+i,c);   
        }
    }
    function up(){
        if(y>1){
            if(cy==ry){
                ry--;
            }
        }
    }
    function down(){
        if(y<18){
            if(cy==ry){
                ry++;   
            }
        }
    }
}
var Ball=function(sx,sy){
    var x=sx;
    var y=sx;
    var dirX=random(0,1)?-1:1;
    var dirY=random(0,1)?-1:1;
    this.update=function(){
        step();
        display();
    }
    function step(){
        var next=board.getColor(x+dirX,y+dirY);
        if(y+dirY>20||y+dirY<1){
            dirY*=-1;   
        }else if(next=='out'){
            dirX=random(0,1)?-1:1;
            dirY=random(0,1)?-1:1;
            x=sx;
            y=sy;
            
        }
        next=board.getColor(x+dirX,y+dirY);
	   if(next=='red'||next=='blue'){
            dirX*=-1;   
        }
	   
        x+=Math.round(dirX);
        y+=Math.round(dirY);
    }
    function display(){
        board.setColor(x,y,'white');   
    }
}
function loop1(){
    board.setColorAll('black');
    for(let i=0;i<players.length;i++){
        players[i].update();
    }
    
    ball.update();
    setTimeout(function(){
        requestAnimationFrame(loop1);
    },100);
}

var board = new Grid(obj('game'),30,20,30);
board.setColorAll('black');
var players = [new player('red',29,[38,40]),new player('blue',2,[87,83])];
var ball=new Ball(15,10),a=0;
loop1();
