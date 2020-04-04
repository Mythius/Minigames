const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fps = 30;
let LOOP;
const game = new Game();

function loop(){
	game.draw(win=>{
		if(win){
			alert('You Win');
		} else {
			alert('You Lose');
		}
	});
}

LOOP = setInterval(loop,1000/fps);