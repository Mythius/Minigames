var db=openDatabase('storage','1.0','storage',1024*2*2);
var Table = function(name){
	function runSQL(com,cal){
		db.transaction(function(tx){
			if(typeof cal == 'function'){
				tx.executeSql(com,undefined,function(t,r){
					setTimeout(function(){
						cal(r);
					},1);
				});
			} else {
				tx.executeSql(com);
			}
		});
	}
	this.add=function(n,data){
//Scores.runSql('INSERT INTO Scores ( name , value ) VALUES ( "adalyn" , 300 )');
		runSQL('INSERT INTO '+name+' ( name , value ) VALUES ( "'+n+'" , "'+data+'" )');
	}
	this.get=function(callback){
		runSQL('SELECT * FROM '+name,function(e){
			callback(e.rows);
		})
	}
	this.init=function(){
		runSQL('CREATE TABLE '+name+' ( name varchar(16) , value varchar(1500) )');
	}
	this.runSql=function(query,callback){
		runSQL(query,callback);
	}
}