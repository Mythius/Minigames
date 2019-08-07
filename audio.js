var auControl = function(directory){
	var sounds = [];
	this.play=function(fName,volume,loops){
		var path=fName.indexOf('/')!=-1?fName:directory+'/'+fName;
		var sound = new Audio(path);
		sound.volume = volume;
		sound.loop = loops;
		sound.play();
		sounds.push({aud:sound,name:fName});
	}
	this.stop = function(fName,del){
		var i=sounds.length;
		while (i--){
			if(sounds[i].name==fName){
				sounds[i].aud.pause();
				if (del) sounds.splice(i,1);
			}
		}
	}
	this.stopAll = function(del){
		for(let s of sounds){
			s.aud.pause();
		}
		if (del) sounds=[];
	}
	this.get = function(name){
		for(let s of sounds){
			if(s.name==name) return sounds[i].aud;
		}
	}
}