var x=1,y=1,z=1;
var w,h,l;
var playing=true;
var rotations=-25;
var isRotating=false;
Object.prototype.setY=function(y){
    this.style.top=y+'px';
};
var layers = [];
function createLayers(x,y,z){
    w=x;h=z;l=y;
    for(let i=0;i<z;i++){
        var e=document.createElement('div');
        layers.push(new Grid(e,x,y,40));
        document.body.appendChild(e);
        for(let j=0;j<layers[i].getData().length;j++){
            layers[i].getData()[j].on('click',function(){
                if(this.style.backgroundColor!='black'){
                    this.style.backgroundColor='black';
                } else {
                    this.style.backgroundColor='white';
                }
            });
            layers[i].getData()[j].on('dblclick',function(){
                if(this.style.backgroundColor!='green'){
                    this.style.backgroundColor='green';
                }
            });
        }
    }
    for(let i=0;i<layers.length;i++){
        layers[i].getElement().setY(0+i*80);
        layers[i].getElement().style.zIndex=layers.length+1-i;
        layers[i].setColorAll('white');
    }
    layers[layers.length-1].getElement().classList.add('last');
}
function tAt(tx,ty,tz,c){
    if(c){
        layers[tz-1].setColor(tx,ty,c);
    } else return layers[tz-1].getTile(tx,ty);
}
function isSolid(cx,cy,cz){
    if(cx>0&&cy>0&&cz>0&&cx<=w&&cy<=l&&cz<=h){
        return tAt(cx,cy,cz).style.backgroundColor=='black';
    } else return true;
}
function isColor(cx,cy,cz,c){
    if(cx>0&&cy>0&&cz>0&&cx<=w&&cy<=l&&cz<=h){
        return tAt(cx,cy,cz).style.backgroundColor==c;
    } else return false;
}
function updatePlayer(cx,cy,cz){
    if(playing){
        tAt(x,y,z,'white');
        if(!isSolid(x+cx,y+cy,z+cz)){
            x+=cx;
            y+=cy;
            z+=cz;
            //zindx(z);
        }
        if(isColor(x,y,z,'green')){
            alert('win');
            playing=false;
        }
        tAt(x,y,z,'red');
    }
}
function zindx(z){
    for(let i=0;i<layers.length;i++){
        layers[i].getElement().style.zIndex=h-i;
    }
    layers[z-1].getElement().style.zIndex=h+3;
}
document.on('keydown',function(e){
    switch(e.keyCode){
        case 87: updatePlayer(0,-1,0); break;
        case 83: updatePlayer(0,1,0); break;
        case 65: updatePlayer(-1,0,0); break;
        case 68: updatePlayer(1,0,0); break;
        case 38: updatePlayer(0,0,-1); break;
        case 40: updatePlayer(0,0,1); break;
        case 37: rotate(22.5); break;
        case 39: rotate(-22.5); break;
    }
});
function rotate(d){
    if(!isRotating){
        isRotating=true;
        rotations+=d;
        for(let i=0;i<layers.length;i++){
            layers[i].getElement().style.transform='rotate(60deg) rotateX(-60deg) rotateY(60deg) rotateZ('+rotations+'deg)';  
        }
        setTimeout(function(){isRotating=false;},300);
    }
}
function load(d){
    var p=d;
    var c=p[0].split('.');
    createLayers(c[0],c[1],c[2]);
    for(let i=0;i<layers.length;i++){
        var a=p[i+1].split('');
        var b=[];
        for(let t=0;t<a.length;t++){
            if(a[t]=='0'){
                b.push('white');
            }else if(a[t]=='1'){
                b.push('black');
            }else if(a[t]=='x'){
                b.push('green');
            }else if(a[t]=='o'){
                b.push('white');
            } else {
                b.push('white');   
            }
        }
        console.log(b);
        layers[i].importColors(b,c[0],c[1],0,0,'white');
        for(let y=1;y<=c[1];y++){
            for(let x=1;x<=c[0];x++){
                if(a[y*c[0]-c[0]+x-1]=='o'){;
                    updatePlayer(x,y,i);
                }
            }
        }
    }
}
upload(obj('input'),function(e){load(e)});
obj('button').on('click',function(){
    var s=w+'.'+l+'.'+h;
    for(let i=0;i<layers.length;i++){
        s+='\n';
        var p=layers[i].getData();
        for(let j=0;j<p.length;j++){
            switch(p[j].style.backgroundColor){
                case 'white': s+='0'; break;
                case 'black': s+='1'; break;
                case 'green': s+='x'; break;
                case 'red': s+='o'; break;
                default: s+='0'; break;
            }
        }
    }
    download('New Maze.3dm',s);
});
obj('#new').on('click',function(){
    createLayers(prompt('Width'),prompt('Length'),prompt('Height'));
    updatePlayer(0,0,0);
});