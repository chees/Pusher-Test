function Game(ctx) {
	this.entities = [];
	this.ctx = ctx;
	this.timer = new Timer();
	this.stats = new Stats();
}

Game.prototype.start = function() {
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.bottom = '0px';
	this.stats.domElement.style.right = '0px';
	document.body.appendChild(this.stats.domElement);
	
	this.lastUpdateTimestamp = Date.now();
	var that = this;
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

