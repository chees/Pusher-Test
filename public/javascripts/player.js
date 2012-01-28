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
	
	this.angle += this.dir * this.game.clockTick * this.turnSpeed;
	
	
	
	if (this.x < 0 || this.x > game.ctx.canvas.width ||
		this.y < 0 || this.y > game.ctx.canvas.height) {
		this.isDead = true;
		console.log('Player hit the wall');
	} else {
		
		//var pixel = this.game.ctx.getImageData(this.x, this.y, 1, 1).data;
		//if (pixel[0] != 0 || pixel[1] != 0 || pixel[2] != 0 || pixel[3] != 0) {
			//console.log(pixel);
			//this.isDead = true;
			//console.log('Player died');
		//}
	}
};

Player.prototype.draw = function(ctx) {
	if (this.isDead) return;
	ctx.strokeStyle = 'rgb('+this.r+','+this.g+','+this.b+')';
	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.lastX, this.lastY);
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
};
