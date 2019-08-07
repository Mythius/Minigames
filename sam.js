var SAM = function(grid,obj,w,h,mil){
	var dim = grid.getDimensions();
	var go = grid.getObject();
	var ox = go.offsetLeft,oy = go.offsetTop;
	var x = 1,y = 1,cx=0,cy=0;
	var ai = false;
	var condition,speed=1;
	var ai_algor;
	var wait = mil||1;

	obj.style.position='absolute';
	obj.style.transition=`left .${wait}s, top .${wait}s linear`; 
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
		moveTo(ox+(x-1)*dim.t+((dim.t-w)/2),oy+(y-1)*dim.t+((dim.t-h)/2));
	}
	this.getPosition = function(){
		return {x:x,y:y};
	};
	this.goTo = function(x,y){
		setPos(x,y);
	};
	this.addControls = function(c,cond){
		condition=cond;
		document.on('keydown',function(e){
			let handled=true;
			switch(e.keyCode){
				case c[0]: cy=-speed; break;
				case c[1]: cy=speed; break;
				case c[2]: cx=-speed; break;
				case c[3]: cx=speed; break;
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
		ai=true;
	};
	this.step = function(info){
		if(ai){
			var dir = ai_algor(info);
			x += dir.x;
			y += dir.y;
			setPos(x,y);
		} else {
			if(typeof condition!='function'||condition(x+cx,y+cy,{cx,cy})){
				x+=cx;
				y+=cy;
				setPos(x,y);
			}
			cx=0;
			cy=0;
		}
	}
	this.setSpeed=function(s){
		speed=s;
	}
}