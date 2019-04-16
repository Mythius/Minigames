var Grid=function(obj,w,h,t){
    obj.style.display='grid';
    obj.style.gridTemplateColumns='repeat(auto-fill,minmax(0px,'+t+'px))';
    obj.style.width=t*w+'px';
    for(let i=0;i<w*h;i++){
        var e=document.createElement('tile');
        e.style.width=t+'px';
        e.style.height=t+'px';
        e.style.backgroundColor=rColor();
        e.style.backgroundSize='contain';
        obj.appendChild(e);
    }
    var tiles=obj.getElementsByTagName('tile');
    function pos(x,y){
        return  y*w-w-1+x;
    }
    function isInBounds(x,y){
        return x>0&&y>0&&x<=w&&y<=h;   
    }
    this.getColor=function(x,y){
        if(isInBounds(x,y)){
            return tiles[pos(x,y)].style.backgroundColor;
        } else return 'out';
    };
    this.getImage=function(x,y){
        if(isInBounds(x,y)){
            return tiles[pos(x,y)].style.backgroundImage;
        } else return 'out';
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
    this.importColors=function(array,width,height,x,y,d){
        function pos2(x2,y2){
               return y2*width-width-1+x2;
        }
        function isInBounds2(a,b){
            return (a>0&&b>0&&a<=width&&b<=height);
        }
        for(let i=1;i<=w;i++){
            for(let j=1;j<=h;j++){
                if(isInBounds2(i+x,j+y)){
                    this.setColor(i,j,array[pos2(i+x,j+y)]);
                } else {
                    this.setColor(i,j,d);
                }
            }
        }
    };
    this.importImages=function(array,width,height,x,y,d){
        function pos2(x2,y2){
               return y2*width-width-1+x2;
        }
        function isInBounds2(a,b){
            return (a>0&&b>0&&a<=width&&b<=height);
        }
        for(let i=1;i<=w;i++){
            for(let j=1;j<=h;j++){
                if(isInBounds2(i+x,j+y)){
                    this.setImage(i,j,array[pos2(i+x,j+y)]);
                } else {
                    this.setImage(i,j,d);   
                }
            }
        }
    };
}