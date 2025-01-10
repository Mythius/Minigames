const canvas = obj('canvas');
const ctx = canvas.getContext('2d');
mouse.start(canvas);
const socket = io();

var BOT_PLAY = [1];

Touch.init(callback=>{
	if(callback.type=='click'){
		mouse.pos.x = callback.x;
		mouse.pos.y = callback.y;
		mouse.down = true;
		loop();
		mouse.down = false;
	}
});

function loop(){
	setTimeout(loop,1000/30);
	ctx.clearRect(-2,-2,canvas.width+2,canvas.height+2);
	drawBoard();
}

let circles = [];

let rotation = [];

let turn = 0;


let counter = 5;
class Spot{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.n = 4;
		this.status = '';
		this.stoneLocations = [];
		circles.push(this);
		this.generateLocations();
		this.qmove = 0;
	}
	draw(){
		let sp = (canvas.width-80)/8;
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.arc(this.x,this.y,sp/2,sp/2,0,Math.PI*2);
		let grayout = rotation.indexOf(this) < 6;
		grayout = grayout ^ turn;
		ctx.strokeStyle = grayout?'white':'#aaa';
		if(this.mouseInCircle() || this.qmove){
			ctx.fillStyle = 'black';
			ctx.fill();
			if((mouse.down||this.qmove==1) && grayout){
				this.qmove = 0;
				setTimeout(()=>{
					this.status = '';
					makeMove(this).then(nextTurn=>{
						if(nextTurn) {
							turn = +!turn;
						}
						doNextTurn();
					});
				},turn==1?1000:0);
			}
		}
		if(this.status == 'Capture'){
			ctx.fillStyle = 'red';
			ctx.fill();
		} else if(this.status == 'Selected'){
			ctx.fillStyle = 'lightblue';
			ctx.fill();
		}
		ctx.stroke();
		this.drawPebbles();
	}
	drawPebbles(){
		ctx.fillStyle = 'white';
		ctx.font = '30px serif'
		ctx.textAlign = 'center';
		ctx.fillText(this.n,this.x,this.y+10);
	}
	generateLocations(){
		for(let j=0;j<3;j++){
			let r = j==2?8:4;
			for(let i=0;i<r;i++){
				let offsetAngle = j==2?22.5:(j%2)*45;
				let pt = Vector.getPointIn(Vector.rad(offsetAngle+i*360/r),(j+1)*10);
				this.stoneLocations.push(pt.add(this.x,this.y));
			}
		}
	}
	mouseInCircle(){
		return Vector.distance(this.x,this.y,mouse.pos.x,mouse.pos.y) < (canvas.width-80)/16;
	}
}

class Goal{
	constructor(player=0){
		this.n = 0;
		this.player = player;
	}
	draw(){
		let sp = (canvas.width-80)/8;
		if(this.player == 0){
			ctx.beginPath();
			ctx.arc(3+sp*.5,canvas.height/4,sp/2,0,Math.PI,true);
			ctx.lineTo(3+sp*.5-sp/2,canvas.height*3/4)
			ctx.arc(3+sp*.5,canvas.height*3/4,sp/2,Math.PI,Math.PI*2,true);
			ctx.lineTo(3+sp*1.5-sp/2,canvas.height/4)
			ctx.stroke();
		} else {
			ctx.beginPath();
			ctx.arc(canvas.width-3-sp*.5,canvas.height/4,sp/2,0,Math.PI,true);
			ctx.lineTo(canvas.width-3-sp*.5-sp/2,canvas.height*3/4)
			ctx.arc(canvas.width-3-sp*.5,canvas.height*3/4,sp/2,Math.PI,Math.PI*2,true);
			ctx.lineTo(canvas.width-3,canvas.height/4)
			ctx.stroke();
		}
		this.drawNumbers();
	}
	drawNumbers(){
		let sp = (canvas.width-80)/8;
		if(this.player == 0){
			ctx.fillStyle = 'white';
			ctx.font = '30px serif'
			ctx.textAlign = 'center';
			ctx.fillText(this.n,sp/2+4,canvas.height/2+10);
		} else {
			ctx.fillStyle = 'white';
			ctx.font = '30px serif'
			ctx.textAlign = 'center';
			ctx.fillText(this.n,canvas.width-sp/2-2,canvas.height/2+10);
		}
	}
}

function drawBoard(){
	for(let s of circles) s.draw();
}


function wait(ms=1000){
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve();
		},ms);
	});
}

function doNextTurn(){
	if(BOT_PLAY.includes(turn)){
		let data = {spots:rotation.map(e=>e.n),turn};
		socket.emit('mancala-pos',data);
	}
}

socket.on('mancala-best',move=>{
	let ix = move - 1 + turn*7;
	rotation[ix].qmove = 1;
	rotation[ix].status = 'Selected';
});


async function makeMove(circle){
	let ix = rotation.indexOf(circle);
	let n = circle.n;
	if(!n) return false;
	circle.n = 0;
	while(n >= 1){
		ix = nextSpot(ix);
		await wait(200);
		rotation[ix].n++
		n--;
	}
	if(turn==0&&ix<6&&rotation[ix].n==1){
		let stealIx = 12-ix;
		if(rotation[stealIx].n>0){
			rotation[ix].status = 'Capture';
			rotation[stealIx].status = 'Capture';
			await wait();
			rotation[ix].status = '';
			rotation[stealIx].status = '';
			rotation[6].n += rotation[ix].n + rotation[stealIx].n;
			rotation[ix].n = 0;
			rotation[stealIx].n = 0;
		}
	}
	if(turn==1&&ix<13&&ix>6&&rotation[ix].n==1){
		let stealIx = 12-ix;
		if(rotation[stealIx].n>0){
			rotation[ix].status = 'Capture';
			rotation[stealIx].status = 'Capture';
			await wait();
			rotation[ix].status = '';
			rotation[stealIx].status = '';
			rotation[13].n += rotation[ix].n + rotation[stealIx].n;
			rotation[ix].n = 0;
			rotation[stealIx].n = 0;
		}
	}
	let sum1 = rotation.slice(0,6).map(e=>e.n).reduce(sum);
	let sum2 = rotation.slice(7,13).map(e=>e.n).reduce(sum);
	if(sum1==0||sum2==0){
		if(sum1==0){
			for(let r of rotation.slice(0,6)) r.status = 'Capture';
		} else {
			for(let r of rotation.slice(7,13)) r.status = 'Capture';
		}
		await wait();
		for(let r of rotation) r.status = '';
		rotation[6].n += sum1;
		rotation[13].n += sum2;
		for(let i=0;i<6;i++) rotation[i].n=0;
		for(let i=7;i<13;i++) rotation[i].n=0;
		return true;
	}
	if(ix==6&&turn==0) return false;
	if(ix==13&&turn==1) return false;
	return true;
}

function nextSpot(ix){
	ix++;
	if(ix==6&&turn==1) ix++;
	if(ix==13&&turn==0) ix++;
	ix = ix % rotation.length;
	return ix;
}

function setup(){
	let sp = (canvas.width-80)/8;
	for(let j=0;j<2;j++){
		for(let i=0;i<6;i++){
			new Spot(sp*1.5+sp*(i*1.15+.14),j==0?canvas.height/4:canvas.height*3/4);
		}
	}
	let g0 = new Goal(0);
	let g1 = new Goal(1);
	rotation = circles.slice(6);
	rotation.push(g1);
	rotation = rotation.concat(circles.slice(0,6).reverse());
	rotation.push(g0);
	circles.push(g0,g1);

	// for(let i=0;i<rotation.length;i++) rotation[i].n=i+1;
}

const sum=(a,b)=>a+b;

setup();
loop();