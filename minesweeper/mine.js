Grid.prototype.isBomb=function(x,y){
    return this.getImage(x,y)=='url("imgs/bomb.png")';
};
Grid.prototype.isEmpty=function(x,y){
    return this.getImage(x,y)=='url("imgs/0.png")';
};
Grid.prototype.equals=function(x,y,e){
    return this.getImage(x,y)=='url("imgs/'+e+'.png")';   
}
Grid.prototype.sameColor=function(x,y,c){
    return this.getColor(x,y)==c;   
}
function makeBombs(amount){
    function s(){
        var a=random(1,10);
        var b=random(1,10);
        if(!minefield.isBomb(a,b)){
            minefield.setImage(a,b,'imgs/bomb.png');
        } else s();
    }
    for(let i=0;i<amount;i++){
        s();
    }
}
function calcNums(){
    for(let i=1;i<=10;i++){
        for(let j=1;j<=10;j++){
            if(!minefield.isBomb(i,j)){
                var amount=0;
                for(let k=-1;k<=1;k++){
                    for(let l=-1;l<=1;l++){
                        amount+=minefield.isBomb(i+k,j+l)?1:0;
                    }
                }
                minefield.setImage(i,j,'imgs/'+amount+'.png');
            }
        }
    }
}
var cover=new Grid(obj('game2'),10,10,30);
var minefield=new Grid(obj('game'),10,10,30);
cover.setImageAll('imgs/cover.png');
for(let i=1;i<=10;i++){
    for(let j=1;j<=10;j++){
        cover.getTile(i,j).on('click',function(){
            clearArea(i,j);
        });
        cover.getTile(i,j).on('contextmenu',function(e){
            e.preventDefault();
            if(!cover.sameColor(i,j,'transparent')){
                if(cover.equals(i,j,'flag')){
                    cover.setImage(i,j,'imgs/cover.png');   
                } else {
                    cover.setImage(i,j,'imgs/flag.png');   
                }
            } else {
                var number=Number(minefield.getImage(i,j).split('/')[1].split('.')[0]);
                var amount=0;
                for(let x=-1;x<=1;x++){
                    for(let y=-1;y<=1;y++){
                        if(cover.equals(x+i,y+j,'flag')){
                            amount++;
                        }
                    }
                }
                if(amount==number){
                    for(let x=-1;x<=1;x++){
                        for(let y=-1;y<=1;y++){
                            if(cover.equals(x+i,y+j,'cover')){
                                clearArea(x+i,y+j);
                            }
                        }
                    }
                }
                console.log(number+' '+amount);
            }
        });
    }
}
function clearArea(x,y){
    if(cover.equals(x,y,'cover')&&playing){
       uncover(x,y);
        if(minefield.isBomb(x,y)){
            die();   
        } else if(minefield.isEmpty(x,y)){
            for(let i=-1;i<=1;i++){
                for(let j=-1;j<=1;j++){
                    if(cover.equals(x+i,y+j,'cover')){
                        clearArea(x+i,y+j);
                    }
                }
            }
        }
    }
}
function uncover(x,y){
    cover.setImage(x,y,'');
    cover.setColor(x,y,'Transparent');
    uncovered++;
    if(uncovered==89) win();
}
function time(){
    secs++;
    setTimeout(function(){
        time();
    },1000);
}
document.on('mousedown',function(){
    if(secs==0)time();
});
function win(){playing=false;alert('You win! Time: '+secs);}
function die(){playing=false;alert('You lose!');}
var playing=true,uncovered=0,secs=0;
makeBombs(10);
calcNums();