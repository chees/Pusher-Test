function Game(ctx) {
	this.entities = [];
	this.ctx = ctx;
	this.timer = new Timer();
	this.stats = new Stats();
}

Game.prototype.start = function() {
	var that = this;
	
	// Stats
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.bottom = '0px';
	this.stats.domElement.style.right = '0px';
	document.body.appendChild(this.stats.domElement);
	
	// Pusher
	var pusher = new Pusher('f4bc874a627d26b1eb2b');
	// TODO generate a new channel for every game
	this.channel = pusher.subscribe('presence-channel');
	this.channel.bind('client-event', function(data) {
		console.log(data); // TODO handle input
	});
	this.channel.bind('pusher:member_added', function(member) {
		//console.log(member.id, member.info);
		that.addPlayer();
	});
	
	// Game loop
	this.lastUpdateTimestamp = Date.now();
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
	
	console.log('Game started');
};

Game.prototype.loop = function() {
	this.clockTick = this.timer.tick();
	this.update();
	this.draw();
	this.stats.update();
};

Game.prototype.update = function() {
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		
		if (!entity.removeFromWorld) {
			entity.update();
		}
	}

	for (var i = this.entities.length-1; i >= 0; --i) {
		if (this.entities[i].removeFromWorld) {
			this.entities.splice(i, 1);
		}
	}
};

Game.prototype.draw = function() {
	//this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	//this.ctx.fillStyle = 'rgba(0, 0, 0, .04)';
	//this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].draw(this.ctx);
	}
};

Game.prototype.addPlayer = function() {
	this.entities.push(new Player(this));
	console.log('Player added');
};
