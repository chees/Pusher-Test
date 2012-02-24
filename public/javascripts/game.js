function Game(ctx, room) {
	this.ctx = ctx;
	this.room = room;
	this.entities = [];
	this.timer = new Timer();
	this.stats = new Stats();
	this.roundFinished = false;
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
	//this.channel = pusher.subscribe('presence-channel');
	this.channel = pusher.subscribe('presence-' + this.room);
	this.channel.bind('pusher:subscription_error', function(d) {
		// TODO
	});
	this.channel.bind('client-event', function(data) {
		that.handleInput(data);
	});
	this.channel.bind('client-meta', function(data) {
		that.handleMeta(data);
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

Game.prototype.handleMeta = function(data) {
	if (data.meta == 'ping') {
		this.channel.trigger('client-meta', {'pong' : data.id});
	}
};

Game.prototype.loop = function() {
	this.clockTick = this.timer.tick();
	this.update();
	this.draw();
	this.stats.update();
};

Game.prototype.update = function() {
	if (this.roundFinished) {
		return;
	}
	
	var somebodyAlive = false;
	
	for (var i = 0; i < this.entities.length; i++) {
		var entity = this.entities[i];
		
		if (!entity.removeFromWorld) {
			entity.update();
			if (!entity.isDead) {
				somebodyAlive = true;
			}
		}
	}
	
	if (this.entities.length > 0 && !somebodyAlive) {
		this.finishRound();
	}
	
	/*
	for (var i = this.entities.length-1; i >= 0; --i) {
		if (this.entities[i].removeFromWorld) {
			this.entities.splice(i, 1);
		}
	}
	*/
};

Game.prototype.draw = function() {
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].draw(this.ctx);
	}
};

Game.prototype.addPlayer = function(id) {
	this.entities.push(new Player(this, id));
	this.message('New Player!');
};

Game.prototype.finishRound = function() {
	this.message('Everybody died');
	this.roundFinished = true;
	setTimeout('game.message(3)', 1000);
	setTimeout('game.message(2)', 2000);
	setTimeout('game.message(1)', 3000);
	setTimeout('game.reset()', 4000);
};

Game.prototype.reset = function() {
	this.roundFinished = false;
	this.ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].reset();
	}
};

Game.prototype.message = function(msg) {
	var msg = $('<p>'+msg+'</p>');
	$('#messages').append(msg);
	msg.fadeIn(500).delay(1000).hide(1500);
};
