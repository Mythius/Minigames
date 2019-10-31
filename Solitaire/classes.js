function Card(n,t){
	var number = n,type = t,faceup = false,flipping = false,image = create('img');
	image.src = getPath();
	image.classList.add('card');
	image.style.transform='rotateY(180deg)';
	this.getImage = () => image;
	function getPath(){
		if(faceup){
			return 'Cards/'+n+t+'.png';
		} else return 'Cards/purple_back.png';
	}
	this.flip = function(){
		if(!flipping){
			flipping = true;
			image.style.transform = 'rotateY(90deg)';
			setTimeout(()=>{
				faceup = !faceup;
				image.src = getPath();
				image.style.transform = 'rotateY(0deg)';
			},150);
			setTimeout(()=>{
				flipping = false;
			},300);
		}

	}
	this.card = n+t;
	this.getColor = () => t == 'D' || t == 'C' ? 'black' : 'red';
}

function Deck(){
	var types = ['C','S','D','H'];
	var nums = [...range(2,11).map(e=>e+''),'K','Q','J','A'];
	var cards = [], stacks = [];
	for(let t of types){
		for(let n of nums){
			cards.push(new Card(n,t));
		}
	}
	cards.sort((a,b)=>Math.random()-.5);
	// 28 start on page
	var count = 0;
	for(let i=1;i<=7;i++){
		let s = new Stack((i-1)*110 + 120,cards.slice(count,count+i));
		count += i;
		stacks.push(s);
	}
	this.getCards = () => cards;
	this.getStacks = () => stacks;
	this.forEach = function(callback){
		for(let i of cards){
			callback(i);
		}
	}
	this.display = function(){
		for(let s of stacks){
			s.display();
		}
		for(let i=count;i<cards.length;i++){
			obj('#users').appendChild(cards[i].getImage());
			cards[i].getImage().style.top = (i-count) * 3 + 10 + 'px';
		}
	}
}

function Stack(x,c){
	var cards = c;
	var div = create('div');
	div.classList.add('stack');
	div.style.left = x + 'px';
	obj('#main').appendChild(div);

	getLast().flip();

	function getLast(){
		return cards[cards.length-1];
	}
	function removeLast(){

	}
	function color(){
		return getLast().getColor();
	}
	this.getCards = () => cards;
	this.display = function(){
		for(let i=0;i<cards.length;i++){
			let card = cards[i];
			card.getImage().style.left = x + 'px';
			card.getImage().style.top = (i * 30) + 10 + 'px';
			div.appendChild(card.getImage());
		}
	}
}