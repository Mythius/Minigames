var SAM = function(grid,obj,w,h){
	var dim = grid.getDimensions();
	var go = grid.getObject();
	var ox = go.offsetLeft,oy = go.offsetTop;
	var x = 1,y = 1;

	var ai_algor;

	obj.style.position='absolute';
	obj.style.transition='left .3s, top .3s linear'; 
	obj.style.width=w+'px';
	obj.style.height=h+'px';
	setPos(x,y);

	function moveTo(x,y){
		obj.style.left=x+'px';
		obj.style.top=y+'px';
	}
	function setPos(xp,yp){
		x=xp;
		y=yp;
		moveTo(ox+(x-1)*dim.t+(Math.max(dim.t-w,0)/2),oy+(y-1)*dim.t+(Math.max(dim.t-h,0)/2));
	}
	this.getPosition = function(){
		return {x:x,y:y};
	};
	this.goTo = function(x,y){
		setPos(x,y);
	};
	this.addControls = function(c,cond){
		document.on('keydown',function(e){
			let handled=true;
			switch(e.keyCode){
				case c[0]: if (typeof cond != 'function'||cond(x,y-1,'u')) y--; break;
				case c[1]: if (typeof cond != 'function'||cond(x,y+1,'d')) y++; break;
				case c[2]: if (typeof cond != 'function'||cond(x-1,y,'l')) x--; break;
				case c[3]: if (typeof cond != 'function'||cond(x+1,y,'r')) x++; break;
				default: handled=false;
			}
			if(handled){
				e.preventDefault();
				setPos(x,y);
			} 
		});
	};
	this.addAI = function(fn){
		ai_algor=fn;
	};
	this.step = function(info){
		var dir = ai_algor(info);
		x += dir.x;
		y += dir.y;
		setPos(x,y);
	}
}