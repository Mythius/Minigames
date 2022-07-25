(function(global){
	const Crossword = {};
	global.Crossword = Crossword;

	var words;

	var trsolve = true;

	var result = [];
	var hints = [];
	var answers = [];

	Crossword.show_letters = false;



	xml('definitions.txt',data=>{
		hints = data.split('\n').map(e=>e.trim());
		xml('nouns.txt',data=>{
			words = data.split('\n').map(e=>e.trim());
			draw();
			Crossword.words = words;
			for(let i=0;i<35;i++) result.push(addWord());
			numberSquares();
			draw();
			result = [...new Set(result)];
			for(let word of result){
				let ix = words.indexOf(word.word);
				let def = hints[ix];
				answers.push({word:word.word,def,dir:word.dir,pos:word.pos});
			}
			console.log(answers);
			printHints();
		});
	});

	var grid;

	Tile.prototype.letter = "";
	Tile.prototype.guess = "";

	Tile.prototype.draw = function(){
		let ct = this.getCenter();
		let s = this.grid.scale;
		let s2 = s/2;
		ctx.save();
		ctx.beginPath();
		ctx.translate(ct.x,ct.y);
		if(this.letter == ''){
			ctx.fillStyle = 'black';
			ctx.rect(-s2,-s2,s,s);
			ctx.fill();
		} else {
			ctx.font = '20px monospace';
			ctx.fillStyle = this.color;
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.rect(-s2,-s2,s,s);
			ctx.fill();
			ctx.stroke();
			if(Crossword.show_letters){
				ctx.beginPath();
				ctx.fillStyle = 'black';
				ctx.fillText(this.letter,-5,7);
				ctx.fill();
			} else if(trsolve){
				ctx.beginPath();
				ctx.fillStyle = 'black';
				ctx.fillText(this.guess,-5,7);
				ctx.fill();
			}
			if(this.num){
				ctx.beginPath();
				ctx.font = '10px monospace';
				ctx.fillStyle = 'black';
				ctx.fillText(this.num,-15,-8);
			}
		}
		ctx.restore();
	}

	Grid.prototype.draw = function(){
		this.forEach(tile=>tile.draw());
	}


	function generate(width,words){
		grid = new Grid(width,width,canvas.width/width,'white');
		Crossword.grid = grid;
		Crossword.grid.forEach(tile=>{tile.color='white'});
		loop();
	}

	function draw(){
		grid.draw();
	}

	function printHints(){
		let i=1;
		for(let hint of answers){
			let pos = hint.pos;
			let tile = grid.getTileAt(pos.x,pos.y);
			console.log(hint,tile,tile.num);
			title = tile.num + ' ' + (hint.dir=='h' ? 'Across' : 'Down') + ': ';
			obj('p').innerHTML += title + hint.def + '<br>';
			i++;
		}
	}

	function checkWordInDir(word,x,y,dx,dy){
		for(var i=-1;i<=word.length;i++){
			let tile = grid.getTileAt(x+dx*i,y+dy*i);
			if(i==-1&& tile && tile.letter!==''){
				return false;
			} else if(i==-1){
				continue;
			}
			if(i == word.length){
				if(!tile) return true;
				return tile.letter=='';
			}
			if(!tile) return false;
			let cx = dx==0 ? 0 : tile.x;
			let cy = dy==0 ? 0 : tile.y;
			if(!lineIsValid(word[i],tile.x,tile.y,cx,cy,dy,dx)){
				return false;
			}
			if(tile.letter == '') continue;
			if(tile.letter != word[i]) return false;
		}
		return true;
	}

	function lineIsValid(letter,lx,ly,x,y,dx,dy){
		var current_word = '';
		var valid = true;
		for(let i=0;i<grid.width;i++){
			let l = '';
			let square = grid.getTileAt(x+dx*i,y+dy*i);
			if(!square) {
				current_word = '';
				continue;
			}
			if(square.x == lx && square.y == ly){
				l = letter;
			} else {
				l = square.letter;
			}
			if(l){
				current_word += l;
			} else {
				if(current_word.length > 1){
					valid &= words.includes(current_word);
					if(!valid) break;
					current_word = '';
				} else {
					current_word = '';
				}
			}
		}
		if(current_word.length > 1){
			valid &= words.includes(current_word);
			current_word = '';
		}
		return valid;
	}

	function findAvailSquare(word){
		var square = null;
		var first = true;
		var dir = '';
		var finaletter = '';
		grid.forEach(tile=>{
			if(tile.letter.length){
				first = false;
			}
			for(let letter of word){
				if(letter == tile.letter){
					let neg = word.indexOf(letter);
					let pos = word.length - neg;
					let vert = checkWordInDir(word,tile.x,tile.y-neg,0,1);
					let horz = checkWordInDir(word,tile.x-neg,tile.y,1,0);
					if(vert) {
						square = tile;
						dir = 'v';
						finaletter = letter;
						return true;
					}
					if(horz){
						square = tile;
						dir = 'h';
						finaletter = letter;
						return true;
					}
				}
			}
		});
		if(first){
			square = grid.getTileAt(0,0);
			return {square,dir:'h'};
		} 
		return {square,dir,letter:finaletter};
	}

	function addWord(){
		let word = words[random(0,words.length-1)].trim();
		let data = findAvailSquare(word);
		var dir = 'h';
		let top_left_pos_square;
		if(data.square !== null){
			var offset = 0;
			if(data.square.letter.length!=0){
				offset = word.indexOf(data.letter);
			}
			if(data.dir == 'h'){
				top_left_pos_square = grid.getTileAt(data.square.x-offset,data.square.y);
				for(let i=0;i<word.length;i++){
					let s = grid.getTileAt(data.square.x+i-offset,data.square.y);
					s.letter = word[i];
					dir = 'h';
				}
			} else if(data.dir == 'v'){
				top_left_pos_square = grid.getTileAt(data.square.x,data.square.y-offset);
				for(let i=0;i<word.length;i++){
					let s = grid.getTileAt(data.square.x,data.square.y+i-offset);
					s.letter = word[i];
					dir = 'v';
				}
			} else {
				console.error('Something went wrong');
			}
		} else {
			return addWord();
		}
		return {word,dir,pos:{x:top_left_pos_square.x,y:top_left_pos_square.y}};
	}

	function numberSquares(){
		let n = 1;
		grid.forEach(tile=>{
			if(tile.letter=='') return;
			let u = grid.getTileAt(tile.x,tile.y-1);
			let l = grid.getTileAt(tile.x-1,tile.y);
			let d = grid.getTileAt(tile.x,tile.y+1);
			let r = grid.getTileAt(tile.x+1,tile.y);
			if(!u || u.letter == ''){
				if(d && d.letter != ''){
					tile.num = n++;
					return;
				}
			}
			if(!l || l.letter == ''){
				if(r && r.letter != ''){
					tile.num = n++;
					return;
				}
			}
		});
	}

	function loop(){
		setTimeout(loop,1000/30);
		if(ctx) ctx.clearRect(-2,-2,canvas.width+2,canvas.height+2);
		getLetter();
		draw();
	}

	Crossword.generate = generate;
	Crossword.add = function(){
		let word = addWord();
		ctx.clearRect(-2,-2,canvas.width+2,canvas.height+2);
		draw();
		return word;
	}
	Crossword.lineIsValid = lineIsValid;
	Crossword.draw = draw;
	Crossword.getLetter = getLetter;

	function getLetter(){
		let s = grid.getActiveTile();
		if(!s) return;
		for(let i=65;i<65+26;i++){
			if(keys.down(String.fromCharCode(i))){
				s.guess = String.fromCharCode(i).toLowerCase();
				return s.guess;
			}
		}
		if(keys.down('backspace')){
			s.guess = '';
		}
	}

})(this);