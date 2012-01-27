function Player(game) {
	this.game = game;
	this.x = Math.random() * game.ctx.canvas.width/2 + game.ctx.canvas.width/4;
	this.y = Math.random() * game.ctx.canvas.height/2 + game.ctx.canvas.height/4;
	this.lastX = this.x;
	this.lastY = this.y;
	this.angle = Math.random() * Math.PI * 2;
	this.speed = 100;
	this.r = Math.floor(Math.random()*256);
	this.g = Math.floor(Math.random()*256);
	this.b = Math.floor(Math.random()*256);
	this.isDead = false;
}

Player.prototype.update = function() {
	if (this.isDead) return;
	
	this.lastX = this.x;
	this.lastY = this.y;
	
	var d = this.game.clockTick * this.speed;
	
	this.x += Math.cos(this.angle) * d;
	this.y -= Math.sin(this.angle) * d;
	
	this.angle += Math.random() * 0.8 - 0.4;
	
	if (this.x < 0 || this.x > game.ctx.canvas.width ||
		this.y < 0 || this.y > game.ctx.canvas.height) {
		this.isDead = true;
		console.log('Player died');
	}
};

Player.prototype.draw = function(ctx) {
	ctx.strokeStyle = 'rgb('+this.r+','+this.g+','+this.b+')';
	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.lastX, this.lastY);
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
};
