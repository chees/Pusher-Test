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
		that.handleInput(data);
	});
	this.channel.bind('pusher:member_added', function(member) {
		//console.log(member.id, member.info);
		that.addPlayer(member.id);
	});
	
	// Game loop
	this.lastUpdateTimestamp = Date.now();
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
	
	console.log('Game started');
};

Game.prototype.handleInput = function(data) {
	for (var i = 0; i < this.entities.length; i++) {
		var ent = this.entities[i];
		if (ent.id == data.id) {
			ent.dir = data.dir;
		}
	}
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
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].draw(this.ctx);
	}
};

Game.prototype.addPlayer = function(id) {
	this.entities.push(new Player(this, id));
	console.log('Player added');
};
