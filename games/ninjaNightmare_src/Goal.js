/**
 * the Goal is the location the player must reach in order to win
 * @param ctx: the context to which the goal belongs
 */
makeChild("Goal","GameObject");
function Goal(x,y,ctx) {
    GameObject.call(this,x,y,"goal",0,-1000,ctx);
    this.particleMaxTimer = 5;
    this.particleTimer = this.particleMaxTimer;
}

/**
 * update the goal
 */
Goal.prototype.update = function() {
    if (--this.particleTimer == 0) {
        this.particleTimer = this.particleMaxTimer;
        activeRoom.addParticle(new Particle(getRandomInt(this.x,this.x+images[this.imgName].width),getRandomInt(this.y,this.y+images[this.imgName].height),
        40,"255,255,0",5,0,0,true,particleShapes.star));
    }
}