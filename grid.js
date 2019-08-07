var Grid=function(obj,w,h,t){
    obj.style.display='grid';
    obj.style.gridTemplateColumns='repeat(auto-fill,minmax(0px,'+t+'px))';
    obj.style.width=t*w+'px';
    var tiles=[];
    for(let i=0;i<w*h;i++){
        var e=document.createElement('tile');
        e.style.width=t+'px';
        e.style.height=t+'px';
        e.style.backgroundColor=rColor();
        e.style.backgroundSize='contain';
        obj.appendChild(e);
        tiles.push(e);
    }
    const pos=(x,y)=>y*w-w-1+x;
    const isInBounds=(x,y)=>x>0&&y>0&&x<=w&&y<=h;   
    this.inBounds=(x,y)=>isInBounds(x,y);
    this.getElement=()=>obj;
    this.getTiles=()=>tiles;
    this.getObject=()=>obj;
    this.getDimensions=function(){return {w:w,h:h,t:t}};
    this.getColor=function(x,y){
        if(isInBounds(x,y)) return tiles[pos(x,y)].style.backgroundColor;
        else return 'out';
    };
    this.getImage=function(x,y){
        if(isInBounds(x,y)) return tiles[pos(x,y)].style.backgroundImage;
        else return 'out';
    };
    this.setColor=function(x,y,c){
        if(isInBounds(x,y)){
            tiles[pos(x,y)].style.backgroundColor=c;
        }
    };
    this.getTile=function(x,y){
        if(isInBounds(x,y)){
            return tiles[pos(x,y)];
        } else return 'out';
    };
    this.setImage=function(x,y,path){
        if(isInBounds(x,y)){
            tiles[pos(x,y)].style.backgroundImage='url('+path+')'; 
        }
    };
    this.setColorAll=function(c){
        for(let i=0;i<tiles.length;i++){
            tiles[i].style.backgroundColor=c;   
        }
    };
    this.setImageAll=function(p){
        for(let i=0;i<tiles.length;i++){
            tiles[i].style.backgroundImage='url('+p+')';   
        }
    };
    this.forEach=function(cal){
        for(let y=1;y<=h;y++){
            for(let x=1;x<=w;x++){
                cal(x,y);
            }
        }
    };
}