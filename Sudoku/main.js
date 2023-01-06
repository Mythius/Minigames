const canvas = obj('canvas');
const ctx = canvas.getContext('2d');

var grid = new Grid(9,9,canvas.width/9);

mouse.start(canvas);
keys.start();

function loop(){
	setTimeout(loop,1000/30);
	ctx.clearRect(-2,-2,canvas.width+2,canvas.height+2);
	solved = isSolved();
	grid.draw();
	let at = grid.getActiveTile();
	if(at){
		at.draw('#222');
		let n = getNum();
		if(n !== null){
			at.num = n;
		}
	}
}

function generateSolution(){
	generating = true;
	reset();
	for(let i=1;i<1+9;i++){
		for(let x=0;x<9;x++){
			depth = 0;
			let successful = addNumber(x,random(0,8),i);
			if(!successful) break;
		}
	}
	// buttonsolve();
	setTimeout(e=>{
		buttonsolve().then(msg=>{
			setTimeout(removeSquares,1000)
			console.log('Removing Squares...');
		})
	},40);
}


var depth = 0;
const max_depth = 15;
function addNumber(x,y,n){
	let s = grid.getTileAt(x,y);
	depth++;
	if(s.num == ''){
		if(!s.row.map(e=>Number(e.num)).includes(n) && !s.box.map(e=>Number(e.num)).includes(n)){
			s.num = ''+n;
			return true;
		} else if(depth < max_depth) {
			return addNumber(x,random(0,8),n);
		} else {
			return false;
		}
	} else if(depth < max_depth){
		return addNumber(x,random(0,8),n);
	} else {
		return false;
	}
}


let boxes = [];
let rows = [];
let cols = [];

const nums = range(1,10).map(e=>e+'');
var solved = false;

Tile.prototype.opts = [...nums];
Tile.prototype.num = "";
Tile.prototype.startNum = false;
Tile.prototype.getOpts = function(){
	let othernums = [...new Set([this.box,this.row,this.col].flat().map(e=>e.num))];
	let opts = [...nums];
	for(let n of othernums){
		opts.remove(n);
	}
	this.opts = opts;
	return opts;
}
Tile.prototype.draw = function(color='black'){
	let ct = this.getCenter();
	ctx.save();
	ctx.translate(ct.x,ct.y);
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.strokeStyle = 'white';
	let scale = this.grid.scale;
	ctx.rect(-scale/2,-scale/2,scale,scale);
	ctx.stroke();
	ctx.fill();
	let s2 = scale/2;
	let s = scale;
	if(this.num){
		ctx.font = '30px monospace';
		ctx.beginPath();
		ctx.fillStyle = this.startNum?'white':(solved?'green':'red');
		ctx.fillText(this.num,-scale/8,10);
		ctx.fill();
	} else {
		ctx.font = '15px monospace';
		let opts = this.opts;
		let j=1;
		for(let i=-s2;i<s2;i+=s/3){
			for(let ii=-s2;ii<s2;ii+=s/3){
				if(opts.includes(''+j)){
					ctx.beginPath();
					ctx.fillStyle = '#666';
					ctx.fillText(j,ii+5,i+16);
					ctx.fill();
				}
				j++;
			}
		}
	}
	ctx.restore();
}
Tile.prototype.toString = function(){
	return `${Math.floor(this.x/3)}${Math.floor(this.y/3)}`
}
grid.forEach(tile=>{
	if(tile.box) return;
	let ts = tile.toString();
	let group = [];
	grid.forEach(nt=>{
		if(nt.toString() == ts){
			group.push(nt);
			nt.box = group;
		}
	});
	boxes.push(group);
});
grid.forEach(tile=>{
	if(tile.col) return;
	let ts = tile.x;
	let group = [];
	grid.forEach(nt=>{
		if(nt.x == ts){
			group.push(nt);
			nt.col = group;
		}
	});
	cols.push(group);
});
grid.forEach(tile=>{
	if(tile.row) return;
	let ts = tile.y;
	let group = [];
	grid.forEach(nt=>{
		if(nt.y == ts){
			group.push(nt);
			nt.row = group;
		}
	});
	rows.push(group);
});
grid.draw = function(){
	function drawLine(x1,y1,x2,y2){
		ctx.strokeStyle = 'white';
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
	}
	ctx.lineWidth = 2;
	this.forEach(tile=>{
		tile.draw();
	});
	ctx.beginPath();
	ctx.lineWidth = 5;
	drawLine(0*canvas.width/3,0,0*canvas.width/3,canvas.height);
	drawLine(1*canvas.width/3,0,1*canvas.width/3,canvas.height);
	drawLine(2*canvas.width/3,0,2*canvas.width/3,canvas.height);
	drawLine(3*canvas.width/3,0,3*canvas.width/3,canvas.height);
	drawLine(0,0*canvas.height/3,canvas.width,0*canvas.height/3);
	drawLine(0,1*canvas.height/3,canvas.width,1*canvas.height/3);
	drawLine(0,2*canvas.height/3,canvas.width,2*canvas.height/3);
	drawLine(0,3*canvas.height/3,canvas.width,3*canvas.height/3);
	ctx.stroke();
}

grid.forEach(tile=>{
	tile.num = '';
});

function getNum(){
	for(let i=1;i<10;i++){
		if(keys.down(''+i)){
			return ''+i;
		}
	}
	if(keys.down('backspace')){
		return '';
	}
	return null;
}

Array.prototype.remove = function(item){
	let ix = this.indexOf(item);
	if(ix != -1){
		this.splice(ix,1);
		return true;
	}
	return false;
}

function isSolved(){
	return !grid.tiles.flat().map(e=>e.num).includes('');
}

function isImposible(){
	let impossible = false;
	grid.forEach(tile=>{
		tile.getOpts();
		if(tile.num == '' && tile.opts.length == 0){
			impossible = true;
			return true;
		}
	});
	return impossible;
}

var generating = false;

async function solve(){
	let progressed = false;
	grid.forEach(tile=>{
		if(tile.num.length){
			for(let square of tile.row) square.opts.remove(tile.num);
			for(let square of tile.col) square.opts.remove(tile.num);
			for(let square of tile.box) square.opts.remove(tile.num);
		}
	});
	grid.forEach(tile=>{
		let opts = tile.getOpts();
		if(tile.num !== '') return;
		if(opts.length == 1){
			tile.num = opts[0];
			progressed = true;
		} else if(opts.length == 0){
			throw new Error('Impossible');
		}
	})
	if(!progressed){
		grid.forEach(tile=>{
			if(tile.num !== '') return;
			let opts = tile.getOpts();
			let has;
			for(let opt of opts){
				has = listHasNumber(tile.box,tile,opt);
				if(!has){ tile.num = opt; progressed=true; break; } 
				has = listHasNumber(tile.row,tile,opt);
				if(!has){ tile.num = opt; progressed=true; break; } 
				has = listHasNumber(tile.col,tile,opt);
				if(!has){ tile.num = opt; progressed=true; break; } 
			}
		});
	}
	if(!progressed){
		// Do Number Check
		// for(let box of boxes){
		// 	let pos = box[0];
		// 	for(let x=0;x<3;x++){
		// 		for(let y=0;y<3;y++){

		// 		}
		// 	}
		// 	for(let x=0;x<3;x++){
		// 		for(let y=0;y<3;y++){
					
		// 		}
		// 	}
		// }
	}
	if(!progressed){
		if(!generating) console.warn('Stuck');
		return false;
	}
	if(isSolved()){
		return true;
	}
	return solve();
	// let promise = new Promise((res,rej)=>{
	// 	setTimeout(e=>{
	// 		res(solve());
	// 	},1000);
	// });
	// return await promise;
}

function listHasNumber(list_of_tiles,tile,num){
	let has = false;
	for(let t of list_of_tiles){
		if(t.num == num) return true;
		if(t.num != '') continue;
		if(t !== tile){
			if(t.opts.includes(num)){
				has = true;
				break;
			}
		}
	}
	return has;
}

function removeSquares(num=50){
	for(let i=81;i>num;i--){
		let x = random(0,8);
		let y = random(0,8);
		let x2 = 8-x;
		let y2 = 8-y;
		grid.getTileAt(x,y).num = '';
		grid.getTileAt(x2,y2).num = '';
	}
}

function reset(str=' '.repeat(81)){
	let i=0;
	grid.forEach(tile=>{
		tile.num = str[i].trim();
		tile.startNum = false;	
		tile.opts = [...nums];
		i++;
	});
}
/*
159  2   23 4    1      9 6 87594 125       769 72385 9 3      4    8 35   2  469
 2 9   145    82      47 8   2   4 6  4   7  1 6   5   6 83      37    221   4 6 
  42   9833      7 8  39  54 217    8  4 3 5  6    571 45  16  7 6      2283   16 
4  7        492 6 7     9 8 49    7    2 6    5    48 6 5     2 2 637        1  3
 2  5   46     2 7  12 8    4 52 1   6     3   3 97 4    9 54  7 4     18   7  2 
9  8   71  1 6 4     4 78   2      4 4 7 1 5 5      3   21 6     7 5 3  19   3  8
47      2     785   2 5   3    9316 7       8 2187    5   8 6   635     2      95
   3 1  2 938      6 5    7    1 6 4 7     2 9 6 3    5    8 9      258 7  9 3   
769342851412587936853961472621854397984273615375196284136728549297435168548619723

first generated puzzle
154  976  83 51   27 4631   98 2  16    3    52  1 83   2876 41   19 37  173  629
 74 623 99285 31 7613 985   5 8  97   73196   92  5 3   145 2967 92 14532 593 71 
358 26 416  514832 4 387  52     15  312 896  69     48  492 7 923675  847 83 529
6 357 2   7294356 95  2    2 569  733 4 8 6 979  548 2    6  24 6123978   7 159 6
6  971 24 9 3  6 7 72  69 88352   61    1    12   38495 97  48 7 3  5 9 28 194  3


49 2 386  18 4  9  5    14  6 427  1 7 3 5 8 2  861 5  21    7  4  5 31  831 4 26
42 79  8  15  3  778   4 365  9  7 8   6 1   1 7  8  396 2   713  1  85  5  87 64
  69    4571 6  8  4  7 21 75  86    64   39    14  75 12 9  3  8  2 4694    85  
      286  1 3 4 9 6   4  11 837269   31 98   926485 38  9   4 5 4 8 9  379      

*/
document.on('keydown',e=>{
	if(e.key.toLowerCase() == 'c' && e.ctrlKey){
		navigator.clipboard.writeText(grid.tiles.flat().map(e=>(' '+(e.startNum?e.num:'')).slice(-1)).join(''));
	}
	if(e.key.toLowerCase() == 'v' && e.ctrlKey){
		navigator.clipboard.readText().then(data=>{
			if(data.length == 81){
				reset(data);
			}
		}).catch(e=>{console.warn('Failed to Paste')});
	}
});

obj('button').on('click',buttonsolve);


function buttonsolve(){
	return new Promise((res,rej)=>{
		grid.forEach(tile=>{
			tile.num = tile.num;
			if(tile.num.length) tile.startNum = true;
			tile.opts = [...nums];
		});
		solve().then(e=>{
			if(e){
				if(generating){
					grid.forEach(tile=>{ tile.startNum = true });
					generating = false;
					res('Finished Generating');
				} else {
					res('Solved');
				}
				generating = false;
			} else if(generating){
				console.log('Retrying...');
				generateSolution();
				buttonsolve().then(e=>{res(e);})
			}
		}).catch(e=>{
			if(generating){
				console.log('Retrying...');
				generateSolution();
				buttonsolve().then(e=>{res(e);})
			} else {
				rej('Failed to Solve');
			}
		});
	})
}

loop();
