var FULLSCREEN = false;
document.onfullscreenchange = () => {FULLSCREEN = !FULLSCREEN};
class mouse{
    static pos = { x: 0, y: 0 };
    static down = false;
    static right = false;
    static transformPos(e){
        var x,y;
        var element = e.target;
        let br = element.getBoundingClientRect();
        if(FULLSCREEN){
            let ratio = window.innerHeight/canvas.height;
            let offset = (window.innerWidth-(canvas.width*ratio))/2;
            x = map(e.clientX-br.left-offset,0,canvas.width*ratio,0,element.width);
            y = map(e.clientY-br.top,0,canvas.height*ratio,0,element.height);
        } else {
            x = e.clientX - br.left;
            y = e.clientY - br.top;
        }
        return {x,y};
    }
    static start(element=document.documentElement) {
        function mousemove(e) {
            let pos = mouse.transformPos(e);
            mouse.pos.x = pos.x;
            mouse.pos.y = pos.y;
        }
        function mouseup(e) {
            if(e.which == 1){
                mouse.down = false;
            } else if(e.which == 3){
                mouse.right = false;
            }
        }
        function mousedown(e) {
            if(e.target != element) return;
            mousemove(e);
            if(e.which == 1){
                mouse.down = true;
            } else if(e.which == 3){
                mouse.right = true;
            }
        }
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        document.addEventListener('mousedown', mousedown);
        document.addEventListener('contextmenu',e=>{e.preventDefault()});
    }
}
class keys{
    static keys = [];
    static start(){
        function keydown(e){
            keys.keys[e.key.toLowerCase()] = true;
        }
        function keyup(e){
            keys.keys[e.key.toLowerCase()] = false;
        }
        document.addEventListener('keydown',keydown);
        document.addEventListener('keyup',keyup);
    }
    static down(key){
        if(key.toLowerCase() in keys.keys){
            return keys.keys[key.toLowerCase()];
        }
        return false;
    }
}
class Touch{
    static touches = [];
    static resolved = [];
    static init(callback){

        function fixid(id){
            return Math.abs(id%10);
        }

        document.on('touchstart',e=>{
            for(let touch of e.changedTouches){
                Touch.touches[fixid(touch.identifier)] = touch;
                // try{e.preventDefault()}catch(e){};
            }
        });

        document.on('touchmove',e=>{
            if(Touch.touches.filter(e=>e).length == 1){
                for(let touch of e.changedTouches){
                    let last_pos = Touch.touches[fixid(touch.identifier)];
                    callback({
                        type: 'scroll',
                        x: touch.clientX,
                        y: touch.clientY,
                        dx: touch.clientX - last_pos.clientX,
                        dy: touch.clientY - last_pos.clientY,
                        target: last_pos.target
                    });
                    touch.action='scroll';
                    Touch.touches[fixid(touch.identifier)] = touch;
                } 
            } else {
                let counter = 0;
                let tmps = [];
                for(let last_pos of Touch.touches.filter(e=>e)){
                    let touch = [...e.changedTouches].filter(e=>last_pos.identifier==e.identifier)[0];
                    if(touch){
                        tmps.push({
                            x: touch.clientX,
                            y: touch.clientY,
                            dx: touch.clientX - last_pos.clientX,
                            dy: touch.clientY - last_pos.clientY
                        });
                        touch.action='zoom';
                        Touch.touches[fixid(touch.identifier)] = touch;
                    } else {
                        tmps.push({
                            x: last_pos.clientX,
                            y: last_pos.clientY,
                            dx: 0,
                            dy: 0
                        });
                    }
                    if(++counter == 2) break;
                }
                let scaley = (tmps[0].y+tmps[0].dy-tmps[1].y-tmps[1].dy)/(tmps[0].y-tmps[1].y);
                let scalex = (tmps[0].x+tmps[0].dx-tmps[1].x-tmps[1].dx)/(tmps[0].x-tmps[1].x);
                let ct = {x:(tmps[0].x+tmps[1].x)/2,y:(tmps[0].y+tmps[1].y)/2};
                // let scale = Math.abs(1-scalex)>Math.abs(1-scaley)?scalex:scaley;
                scalex = Math.max(Math.min(scalex,2),.5);
                scaley = Math.max(Math.min(scaley,2),.5);
                let scale = scaley;
                if(Math.abs(scale)>2) return;
                if(isNaN(scale)) return;
                if(scale == 0) return;
                callback({
                    type: 'zoom',
                    touch1: tmps[0],
                    touch2: tmps[1],
                    scale,
                    ct
                });
            }
        })

        document.on('touchend',e=>{
            for(let touch of e.changedTouches){
                let ot = Touch.touches[fixid(touch.identifier)];
                if(!ot.action){
                    let dx=ot.clientX-touch.clientX,dy=ot.clientY-touch.clientY;
                    let br = ot.target.getBoundingClientRect();
                    if(Math.sqrt(dx**2+dy**2) < 5){
                        callback({
                            type:'click',
                            x:ot.clientX - br.x,
                            y:ot.clientY - br.y,
                            target:ot.target
                        });
                    }
                } else {
                    let br = ot.target.getBoundingClientRect();
                    callback({
                        type: 'end',
                        x:ot.clientX - br.x,
                        y:ot.clientY - br.y,
                        target:ot.target
                    });
                }
                Touch.touches[fixid(touch.identifier)] = null;
            }
        });
    }
}