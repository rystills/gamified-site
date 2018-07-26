particleShapes = new Enum();
particleShapes.add("circle");
particleShapes.add("star");

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
function Particle(x,y,life,color,radius,xChange, yChange,fadeOut,shape=particleShapes.circle) {
    GameObject.call(this,x,y,null,1000,1000);
    this.maxLife = life;
    this.life = life;
    this.radius = radius;
    this.xChange = xChange;
    this.yChange = yChange;
    this.color = color;
    this.fadeOut = fadeOut;
    this.opacity = 1;
    this.shape = shape;
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
}

/**
 * render the particle to the screen
 */
Particle.prototype.render = function() {
    ctx.fillStyle = "rgba(" + this.color + ", " + this.opacity + ")";
    ctx.strokeStyle = ctx.fillStyle;
    switch(this.shape) {
        case particleShapes.circle:
            this.drawCircle();
            break;
        case particleShapes.star:
            this.drawStar(5,this.radius,this.radius/2);
            break;
    } 
}

/**
 * draw a circle
 */
Particle.prototype.drawCircle = function() {
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
}

/**
 * draw a star - method adopted from https://stackoverflow.com/a/25840319
 */
Particle.prototype.drawStar = function(spikes,outerRadius,innerRadius) {
      var rot=Math.PI/2*3;
      var step=Math.PI/spikes;
      var x = this.x;
      var y = this.y;
      ctx.beginPath();
      ctx.moveTo(this.x,this.y-outerRadius)
      for(i=0;i<spikes;i++){
        x=this.x+Math.cos(rot)*outerRadius;
        y=this.y+Math.sin(rot)*outerRadius;
        ctx.lineTo(x,y)
        rot+=step

        x=this.x+Math.cos(rot)*innerRadius;
        y=this.y+Math.sin(rot)*innerRadius;
        ctx.lineTo(x,y)
        rot+=step
      }
      ctx.lineTo(this.x,this.y-outerRadius);
      ctx.closePath();
      ctx.lineWidth=5;
      ctx.stroke();
      ctx.fill();
}