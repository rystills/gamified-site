/**
 * Particle class; defines a basic particle for rendering effects
 * @param x: start x coord
 * @param y: start y coord
 * @param life: number of frames alive
 * @param color: a string containing the rgb portion of the particle color - formatted as "x,y,z"
 * @param radius: the radius of the circle drawn by this particle
 * @param xChange: change in x each frame
 * @param yChange: change in y each frame
 * @param fadeOut: whether or not to disappear gradually over time
 */
makeChild("Particle","GameObject");
function Particle(x,y,life,color,radius,xChange, yChange,fadeOut) {
    this.x = x;
    this.y = y;
    this.maxLife = life;
    this.life = life;
    this.radius = radius;
    this.xChange = xChange;
    this.yChange = yChange;
    this.color = color;
    this.fadeOut = fadeOut;
    this.opacity = 1;
}

/**
 * update the particle, ticking its life and updating each of its properties
 */
Particle.prototype.update = function() {
    if (--this.life == 0) return;
    this.x += this.xChange;
    this.y += this.yChange;
    if (this.fadeOut) {
        this.opacity = (this.life / this.maxLife);
    }
   // console.log("xChange: " + this.xChange + ", yChange: " + this.yChange);
}

/**
 * render the particle to the screen
 */
Particle.prototype.render = function() {
    ctx.fillStyle = "rgba(" + this.color + ", " + this.opacity + ")";
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
}