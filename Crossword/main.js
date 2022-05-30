const canvas = obj('canvas');
const ctx = canvas.getContext('2d');


Crossword.generate(15,8);

mouse.start(canvas);
keys.start();

Touch.init(data=>{
	mouse.pos.x = data.pos.x;
	mouse.pos.y = data.pos.y;
	mouse.down = true;
	setTimeout(()=>{
		mouse.down = false;
	},300);
});