function obj(id){return document.querySelector(id);}
var file;
function readSingleFile(evt) {
    var f=evt.target.files[0];
    if(f){
        var r=new FileReader();
        r.onload=function(e) {
            var contents=e.target.result;
            var cont=contents.split('\n');
            file=cont;
            var i=0;
            loop();
            function loop(){
                var l=document.createElement('li');
                var b=document.createElement('button');
                l.appendChild(b);
                b.innerText='Load Level';
                b.addEventListener('click',function(){
                    obj('#cc').value=this.parentElement.getAttribute('code');
                });
                l.setAttribute('code',cont[i]);
                obj('upload').querySelector('ul').appendChild(l);
                if(++i<cont.length) requestAnimationFrame(loop);
            }
        };
        r.readAsText(f);
    }
}