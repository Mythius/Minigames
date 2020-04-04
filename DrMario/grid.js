class Tile {
    static scale = 40;
    static face = new Image();
    constructor(x, y) {
        Tile.face.src = 'face.png';
        this.x = x;
        this.y = y;
        this.value = 0;
        this.color = 'black';
        this.solid = false;
        this.virus = false;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'white';
        ctx.rect(this.x*Tile.scale,this.y*Tile.scale,Tile.scale,Tile.scale);
        ctx.fill();
        // ctx.stroke();
        if(this.virus) ctx.drawImage(Tile.face,this.x*Tile.scale,this.y*Tile.scale,Tile.scale,Tile.scale);
    }
    hasPoint(x,y) {
        return x >= this.x * Tile.scale &&
            x < this.x * Tile.scale + Tile.scale &&
            y >= this.y * Tile.scale &&
            y < this.y * Tile.scale + Tile.scale;
    }
    setData(solid=false,virus=false,color=this.color){
        this.color = color;
        this.solid = solid;
        this.virus = virus;
    }
    clear(){
        if(this.color != 'white') this.setData(false,false,'black');
    }
}

class Grid {
    constructor(w,h) {
        this.tiles = [];
        this.width = w;
        this.height = h;
        for (let x = 0; x < w; x++) {
            let row = [];
            for (let y = 0; y < h; y++) {
                row.push(new Tile(x, y));
            }
            this.tiles.push(row);
        }
    }
    inBounds(x,y){
    	return x>=0&&x<this.width&&y>=0&&y<this.height;
    }
    getTileAt(x,y){
    	if(this.inBounds(x,y)){
    		return this.tiles[x][y];
    	}
    }
    forEach(callback) {
        for (let row of this.tiles) {
            for (let tile of row) {
                let stop = callback(tile);
                if (stop) return;
            }
        }
    }
    draw() {
        this.forEach(tile => {
            tile.draw();
        });
    }
    getActiveTile() {
        let result;
        this.forEach(tile => {
            if (tile.hasPoint(MOUSE.pos.x, MOUSE.pos.y)) {
                result = tile;
                return true;
            }
        });
        return result;
    }
}

class _keys {
    constructor(){
        this.keys = [];
        document.addEventListener('keydown',e=>{
            this.keys[e.key] = true;
        });
        document.addEventListener('keyup',e=>{
            this.keys[e.key] = false;
        });
    }
    down(key){
        if(key in this.keys){
            return this.keys[key];
        }
        return false;
    }
}

class virus{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
    }
    add(){
        let tile = pill.game.board.getTileAt(this.x,this.y);
        if(tile){
            tile.setData(true,true,this.color);
        }
    }
    remove(){
        pill.game.things.splice(pill.game.things.indexOf(this),1);
    }
}

class pill{
    static game;
    constructor(color1,color2,game){
        let h1 = new half_pill(color1,this,3,0,game);
        let h2 = new half_pill(color2,this,4,0,game);
        this.x = 3;
        this.y = 0;
        this.parts = [h1,h2];
        this.active = true;
        this.dir = 0;
    }
    blur(){
        for(let part of this.parts){
            part.active = false;
        }
    }
    canfall(){
        return this.parts[0].paircanfall() + this.parts[1].paircanfall() < 2;
    }
    fall(){
        if(this.canfall()){
            this.y++;
            this.update_parts();
            return true;
        }
        return false;
    }
    update_parts(){
        this.parts[0].moveTo(this.x,this.y);
        this.parts[1].moveTo(this.x+Math.round(Math.cos(this.dir*Math.PI/180)),this.y+Math.round(Math.sin(this.dir*Math.PI/180)));
    }
    rotate(){
        if(this.can_rotate()){
            this.dir = (this.dir + 90) % 360;
            this.update_parts();
        }
    }
    move(delta_x){
        if(this.canMove(delta_x)){
            this.x += delta_x;
            this.update_parts();
        }
    }
    can_rotate(){
        let board = pill.game.board;
        this.parts[0].add(false);
        this.parts[1].add(false);
        let t1 = board.getTileAt(this.x,this.y);
        let t2 = board.getTileAt(this.x+Math.round(Math.cos((this.dir+90)*Math.PI/180)),this.y+Math.round(Math.sin((this.dir+90)*Math.PI/180)));
        if(!t1 || !t2) return false;
        return !(t1.solid || t2.solid);
    }
    canMove(delta_x){
        let board = pill.game.board;
        this.parts[0].add(false);
        this.parts[1].add(false);
        let t1 = board.getTileAt(this.parts[0].x+delta_x,this.y);
        let t2 = board.getTileAt(this.parts[1].x+delta_x,this.y);
        if(!t1 || !t2) return false;
        return !(t1.solid || t2.solid);
    }
}

class half_pill{
    constructor(color,pill,x,y,game){
        this.pill = pill;
        this.color = color;
        this.x = x;
        this.y = y;
        this.active = true;
        game.things.push(this);
    }
    moveTo(x,y){
        this.x = x;
        this.y = y;
    }
    add(solid=true){
        pill.game.board.getTileAt(this.x,this.y).setData(solid,false,this.color);
    }
    remove(){
        pill.game.things.splice(pill.game.things.indexOf(this),1);
        this.pill.parts.splice(this.pill.parts.indexOf(this),1);
    }
    canfall(){
        if(this.pill.parts.length == 1){
            let under_this = pill.game.board.getTileAt(this.x,this.y+1);
            if(under_this){
                return !under_this.solid;
            } else return false;
        } else return this.pill.canfall();
    }
    paircanfall(){
        let under_this = pill.game.board.getTileAt(this.x,this.y+1);
        if(under_this){
            for(let part of this.pill.parts){
                if(part != this){
                    if(part.x == under_this.x && part.y == under_this.y) return 0;
                }
            }
            return under_this.solid?5:0;
        } else return 5;
    }
    fall(){
        let can_fall = this.canfall();
        if(can_fall){
            this.y++;
        }
        return can_fall;
    }
}

class Game{
    static virus_count = 12;
    #reset_at = 20;
    #cd = this.#reset_at;
    constructor(){
        this.width = 8;
        this.height = 16;
        this.board = new Grid(this.width,this.height);
        this.things = [];
        this.active;
        this.playing = true;
        canvas.width = this.width * Tile.scale;
        canvas.height = this.height * Tile.scale;
        pill.game = this;
        let b = this.board;
        this.generateViruses(Game.virus_count);

        b.getTileAt(0,0).setData(true,false,'white');
        b.getTileAt(1,0).setData(true,false,'white');
        b.getTileAt(2,0).setData(true,false,'white');
        b.getTileAt(5,0).setData(true,false,'white');
        b.getTileAt(6,0).setData(true,false,'white');
        b.getTileAt(7,0).setData(true,false,'white');
    }
    draw(gameover=()=>{}){
        if(!this.playing) return;
        this.inputData();
        this.#cd = Math.max(this.#cd - 1, 0);
        if(this.#cd == 0){
            if(this.active){
                if(!this.active.fall()){
                    this.active = null;
                    keys.s = false;
                } else {
                    this.#cd = this.#reset_at;
                }
            } else if(this.moveDown()){
                debugger;
                // pieces fell
            } else if(this.removeStuff(gameover)){
                // pieced got removed
            } else if(!this.makePill()){
                this.playing = false;
                gameover(false);
            } else {
                this.#cd = this.#reset_at;
            }
        }
        this.board.forEach(tile=>{
            tile.clear();
        });
        for(let thing of this.things){
            thing.add();
        }
        this.board.draw();
    }
    generateViruses(amount){
        for(let i=0;i<amount;i++){
            this.generateVirus();
        }
    }
    generateVirus(){
        let colors = ['red','yellow','blue'];
        let x = this.random(0,this.width-1);
        let y = Math.min(this.random(2,this.height-6) + this.random(2,this.height-3),this.height-1);
        let tile = this.board.getTileAt(x,y);
        let not_occupied = tile && !tile.virus;
        if(not_occupied){
            if(tile){
                let color = colors[this.random(0,2)]
                let v = new virus(x,y,color);
                this.things.push(v);
                tile.setData(true,true,color);
            } else {
                console.log('Error');
                this.generateVirus();
            }
        } else {
            this.generateVirus();
        }
    }
    random(min,max){
        return min + Math.floor(Math.random()*(max-min+1));
    }
    makePill(){
        let colors = ['red','yellow','blue'];
        let t1 = this.board.getTileAt(3,0);
        let t2 = this.board.getTileAt(4,0);
        if(t1.solid || t2.solid) return false;
        this.active = new pill(colors[this.random(0,2)],colors[this.random(0,2)],this);
        return true;
    }
    inputData(){
        if(this.active){
            if(keys.down('s')){
                this.active.fall();
            }
            if(keys.down('w')){
                this.active.rotate();
                keys.keys.w = false;
            }
            if(keys.down('a')){
                this.active.move(-1);
                keys.keys.a = false;
            }
            if(keys.down('d')){
                this.active.move(1);
                keys.keys.d = false;
            }
        }
    }
    checkWin(){
        let virus_count = 0;
        for(let thing of this.things){
            if(thing instanceof virus){
                virus_count++;
            }
        }
        return virus_count == 0;
    }
    removeStuff(gameover){
        let did_stuff = false;
        for(let thing of this.things){
            did_stuff |= this.checkToRemove(thing);
        }
        if(did_stuff){
            if(this.checkWin()){
                this.playing = false;
                gameover(true);
            }
        }
        return did_stuff;
    }
    checkToRemove(vir){
        return this.checkDir(vir,1,0) || this.checkDir(vir,-1,0) || this.checkDir(vir,0,-1) || this.checkDir(vir,0,1);
    }
    checkDir(vir,dx,dy){
        let stack = [];
        let c = 0;
        while(true){
            let tile = this.board.getTileAt(vir.x+dx*c,vir.y+dy*c);
            if(tile && tile.color == vir.color){
                stack.push(tile);
                c++;
            } else {
                break;
            }
        }
        if(stack.length >= 4){
            for(let tile of stack){
                let thing = this.getThingAt(tile.x,tile.y);
                if(thing) thing.remove();
            }
            return true;
        }
        return false;
    }
    getThingAt(x,y){
        let thing = this.things.filter(t=>t.x == x && t.y == y);
        if(thing.length) return thing[0];
        else return null;
    }
    moveDown(){
        let did_stuff = false;
        for(let thing of this.things){
            if(thing instanceof half_pill){  
                did_stuff |= thing.fall();
            }
        }
        return did_stuff;
    }
}

const keys = new _keys();