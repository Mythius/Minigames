function xml(f,fn){
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status==200) {
            fn(this.responseText);
        }   
    };
    xmlhttp.open("GET",f,true);
    xmlhttp.send();
}