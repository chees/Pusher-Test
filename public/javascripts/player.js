function Player(game, id) {
	this.game = game;
	this.id = id;
	this.x = Math.random() * game.ctx.canvas.width/2 + game.ctx.canvas.width/4;
	this.y = Math.random() * game.ctx.canvas.height/2 + game.ctx.canvas.height/4;
	this.lastX = this.x;
	this.lastY = this.y;
	this.dir = 0; // Requested direction change
	this.angle = Math.random() * Math.PI * 2;
	this.speed = 100;
	this.turnSpeed = 3;
	this.lineWidth = 16;
	this.r = Math.floor(Math.random()*256);
	this.g = Math.floor(Math.random()*256);
	this.b = Math.floor(Math.random()*256);
	this.isDead = false;
}

Player.prototype.update = function() {
	if (this.isDead) return;
	
	this.angle += this.dir * this.game.clockTick * this.turnSpeed;
	
	// Calculate collision coordinates. If they are too close the player
	// will hit his previous step, so we calculate them outside his radius:
	var cx = this.x + Math.cos(this.angle) * ((this.lineWidth / 2) + 2);
	var cy = this.y - Math.sin(this.angle) * ((this.lineWidth / 2) + 2);
	
	if (cx < 0 || cx > game.ctx.canvas.width ||
		cy < 0 || cy > game.ctx.canvas.height) {
		this.die();
	} else {
		var pixel = this.game.ctx.getImageData(cx, cy, 1, 1).data;
		if (pixel[0] != 0 || pixel[1] != 0 || pixel[2] != 0 || pixel[3] != 0) {
			this.die();
		}
	}
	
	// Now calculate the actual coordinates:
	this.lastX = this.x;
	this.lastY = this.y;
	
	// Used Math.min to avoid big jumps:
	var d = Math.min(this.game.clockTick * this.speed, this.lineWidth/2);
	
	this.x += Math.cos(this.angle) * d;
	this.y -= Math.sin(this.angle) * d;
};

Player.prototype.die = function() {
	this.isDead = true;
	console.log('Player died');
	var ctx = this.game.ctx;
	
	ctx.beginPath();
	ctx.moveTo(this.x - 1, this.y - 2);
	ctx.lineTo(this.x - 5, this.y + 2);
	ctx.moveTo(this.x + 1, this.y - 2);
	ctx.lineTo(this.x + 5, this.y + 2);
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb(0, 0, 0)';
	ctx.stroke();
};

Player.prototype.draw = function(ctx) {
	if (this.isDead) return;
	
	ctx.beginPath();
	ctx.moveTo(this.lastX, this.lastY);
	ctx.lineTo(this.x, this.y);
	
	ctx.lineCap = 'round';
	ctx.strokeStyle = 'rgb('+this.r+','+this.g+','+this.b+')';
	ctx.lineWidth = this.lineWidth;
	ctx.stroke();
	
	ctx.lineCap = 'round';
	ctx.lineWidth = this.lineWidth - 2;
	ctx.strokeStyle = 'rgb(255, 255, 255)';
	ctx.stroke();
	
	ctx.closePath();
	
	// Eyes
	ctx.beginPath();
	ctx.moveTo(this.x - 5, this.y - 2);
	ctx.lineTo(this.x - 1, this.y + 2);
	ctx.moveTo(this.x + 5, this.y - 2);
	ctx.lineTo(this.x + 1, this.y + 2);
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb(0, 0, 0)';
	ctx.stroke();
};
