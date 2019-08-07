// Setup board object, matrix ('math' array)
const board = new Grid(obj('game'),5,5,80);
board.setColorAll('gray');
// Global Variables
var startx = random(1,5),endx=3,endy=6;
var seconds=0,t,started=false,done=false;

init();

function init(){
	let r=random(1,3);
	if(r==1){
		endx=0;
		endy=random(2,5);
	} else if(r==2){
		endx=6;
		endy=random(2,5);
	} else {
		endx=random(1,5);
		endy=6;
	}
	// Position Images
	obj('#start').style.left=startx*80+'px';
	obj('#end').style.left=endx*80+'px';
	obj('#end').style.top=endy*80+'px';
}

// numbers correlate with images with (6) being blank gray square
const math=[...range(0,6),...range(0,6),...range(0,6),...range(0,6),6];
math.sort(e=>Math.random()-.5); // shuffle array
update(); // display
function timer(){ if(!done) checkPath(); seconds++; }

// describe how shapes look for pathfinder
const shape=
[
	[[-1,0],[0,-1]],
	[[-1,0],[0,1]],
	[[1,0],[0,1]],
	[[1,0],[0,-1]],
	[[0,-1],[0,1]],
	[[-1,0],[1,0]]
];
// setup click events that move pieces
board.forEach(function(x,y){
	board.getTile(x,y).on('click',function(event){
		if(math[pos(x,y+1)]==6){
			swap({x,y},{x:x,y:y+1});
		} else if(math[pos(x,y-1)]==6){
			swap({x,y},{x:x,y:y-1});
		} else if(math[pos(x+1,y)]==6){
			swap({x,y},{x:x+1,y:y});
		} else if(math[pos(x-1,y)]==6){
			swap({x,y},{x:x-1,y:y});
		}
	});
});
// swaps two pieces @params: object containing x,y pos of each pieces
function swap(t1,t2){
	let r1=math[pos(t1.x,t1.y)];
	let r2=math[pos(t2.x,t2.y)];
	math[pos(t1.x,t1.y)]=r2;
	math[pos(t2.x,t2.y)]=r1;
	update();
	if(!started){
		started=true;
		t=setInterval(timer,1000);
	}
}
// converts x,y into 1D array index for a 5x5 array
const pos=(x,y)=>y*5-5-1+x;
// converts array index into x,y pos (5x5) @retrun {x,y}
function xy(p){return{x:p%5+1,y:Math.floor(p/5)+1}}

// updates html elements based on math matrix
function update(){
	var i=0;
	var pieces=math.map(e=>`imgs/${e}.png`);
	board.forEach(function(x,y){
		board.setImage(x,y,pieces[i++]);
	});
}
// adds keyboard event to move pieces
document.on('keydown',function(e){
	var cont=[87,83,65,68],handled=true;
	const getKey=false;
	if(getKey) alert(e.keyCode);
	switch(e.keyCode){
		case cont[0]: move(0,1); break;
		case cont[1]: move(0,-1); break;
		case cont[2]: move(1,0); break;
		case cont[3]: move(-1,0); break;
		default: handled=false;
	}
	// handle unused keys
	if(handled){
		e.preventDefault();
	}
});

// @param cx,cy vertical/horizontal direction of movement
// moves a piece that direction to fill empty space


function move(cx,cy){
	var p = xy(math.indexOf(6));
	var p2={x:p.x+cx,y:p.y+cy};
	if(board.inBounds(p2.x,p2.y)) swap(p,p2);
}
function checkPath(){
	var p = new PathFinder(startx);
	let win=p.start({x:Math.max(Math.min(endx,5),1),y:Math.min(endy,5)});
	if(win){
		done=true;
		clearInterval(t);
		let display=create('div',`You Win! <br> Time: ${seconds} seconds`);
		display.classList.add('popup');
		display.on('click',function(){this.remove()});
		document.body.appendChild(display);
	}
}
//Path finder class to check if you win
function PathFinder(sx){
	var x=sx,y=0;
	var dirx=0,diry=1;
	function moveDir(delx,dely){
		dirx=delx;
		diry=dely;
		x+=dirx;
		y+=diry;
	}
	function getPathDir(x,y){ return x>5||x<1||y>5||y<1?'out':shape[math[pos(x,y)]]; }
	function checkMove(){
		if(getPathDir(x+dirx,y+diry)=='out') return {should:false,out:true};
			// return that it left the board making it (a complete path)
		try {
			let a=getPathDir(x+dirx,y+diry).map(e=>JSON.stringify(e));
			let b=JSON.stringify(opDir());
			let ix = a[(a.indexOf(b)+1)%2];
			let bool=math[pos(x+dirx,y+diry)]==6?false:a.indexOf(b)>=0;
			return {should:bool,dir:eval(ix),out:false}
			// return the direction to the next piece
		} catch(e){ return {should:false,out:false} }
			// error probably means the path ends
	}
	function opDir(){ return [dirx*-1,diry*-1]; }
	this.start=function(dest){
		var cont=true;
		// repeat until path ends (should)
		while(cont){
			var chk = checkMove();
			// Get next path
			cont=chk.should;
			if(cont){
				// If path available: move
				moveDir(dirx,diry);
				dirx=chk.dir[0];
				diry=chk.dir[1];
			} else {
				//@return if it is next to <dest> and exits map
				let f = dest.x==x&&dirx+x==endx&&diry+y==endy&&dest.y==y&&chk.out;
				return f;
			}
		}
	}
}