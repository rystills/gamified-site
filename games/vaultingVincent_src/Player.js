/**
 * Player class: describes the playable charaacter
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 */
makeChild("Player","GameObject");
function Player(x,y) {
    GameObject.call(this,x,y,"player",100,100);
    this.startX = x;
    this.startY = y;
    this.reset();
}

/**
 * reset all of the player properties to their default value
 */
Player.prototype.reset = function() {
    this.dead = false;

    this.x = this.startX;
    this.y = this.startY;
    this.yvel = 0;
    this.xvel = 0;
    this.xAccelGround = 10;
    this.xAccelAir = 10;
    this.xvelMax = 6;
    this.yAccel = .85;
    this.yVelMax = 10;
    this.jumpVel = 11;
    this.wallJumpYVel = 9;
    this.walljumpXVel = 6;
    this.xDecelGround = 10;
    this.xDecelAir = 10;
    this.grounded = false;
    this.wallSliding = false;
    this.wallDir = "left";
    this.yVelSlide = 0;
    this.wallClimbVel = 4;
    
    this.wallJumpMaxVelocityTimer = 10;
    this.wallJumpVelocityTimer = 0;
    this.jumpMaxHoldTimer = 10;
    this.jumpHoldTimer = 0;
    this.jumpMaxBuffer = 15;
    this.jumpBuffer = 0;
    this.jumpPressed = false;

    this.canDash = true;
    this.dashDir = "left";
    this.dashMaxTimer = 10;
    this.dashTimer = 0;
    this.dashVel = 18;

    this.faceDir = "right";
}

/**
 * move outside of all rect collisions on the specified axis
 * @param isXAxis: whether we wish to move on the x axis (true), or the y axis (false)
 * @param sign: the direction in which we wish to move (-1 or 1, given by Math.sign)
 * @param collidingObject: object to move outside of collision with. If left blank, all solid tiles are checked for collision instead
 * @returns whether a collision was found and resolved or not
 */
Player.prototype.moveOutsideCollisions = function(isXAxis, moveSign, collidingObject = null) {
    let collisionResolved = false;
    
    if (collidingObject != null) {
        if (this.collide(collidingObject)) {
            collisionResolved = true;
            this.translate(isXAxis,(isXAxis ? this.intersect(collidingObject).x : this.intersect(collidingObject).y) * moveSign);
        }
    }
    else {
        for (let i = 0; i < activeRoom.tiles.length; ++i) {
            if (tileProperties[activeRoom.tiles[i].type].state == tileStates.solid && this.collide(activeRoom.tiles[i])) {
                collisionResolved = true;
                this.translate(isXAxis,(isXAxis ? this.intersect(activeRoom.tiles[i]).x : this.intersect(activeRoom.tiles[i]).y) * moveSign);
            }
        }
    }
    return collisionResolved;
}

/**
 * tick all timers down by one frame
 */
Player.prototype.tickTimers = function() {
    this.jumpHoldTimer = keysDown["B"] ? clamp(this.jumpHoldTimer - 1, 0, this.jumpMaxHoldTimer) : 0;
    this.jumpBuffer = clamp(this.jumpBuffer-1, 0, this.jumpMaxBuffer);
    this.wallJumpVelocityTimer = clamp(this.wallJumpVelocityTimer - 1, 0, this.wallJumpMaxVelocityTimer);
    this.dashTimer = clamp(this.dashTimer - 1, 0, this.dashMaxTimer);
}

/**
 * apply acceleration and deceleration to horizontal movement, then update x position
 */
Player.prototype.updateHorizontalMovement = function() {
    if (this.wallJumpVelocityTimer == 0 && this.dashTimer == 0) {
        //horizontal movement (when not locked out by walljump timer)
        if (!this.wallSliding && ((keysDown["A"] || keysDown["D"]) && !(keysDown["A"] && keysDown["D"]))) {
            this.xvel = clamp(this.xvel-(this.grounded ? this.xAccelGround : this.xAccelAir)*(keysDown["D"] ? -1 : 1), -this.xvelMax, this.xvelMax);
        }
        //horizontal deceleration
        else {
            let xDecel = this.grounded ? this.xDecelGround : this.xDecelAir;
            this.xvel -= Math.abs(this.xvel) <= (xDecel) ? this.xvel : Math.sign(this.xvel) * (xDecel);
        }
        //clamp xvel to max when not performing a dash or walljump
        this.xvel = clamp(this.xvel,-this.xvelMax,this.xvelMax);
    }
    //apply resulting x velocity to x coordinate
    this.x += this.xvel;
    if (this.grounded && (Math.abs(this.xvel) > 1)) {
        //spawn running particles
        this.spawnParticles(10,this.cx() - images[this.imgName].width/2,this.cx() + images[this.imgName].width/2,
        this.cy() +  images[this.imgName].height/4, this.cy() +  images[this.imgName].height/2, 10,"255,255,255",3,this.xvel/16,-.1);
    }
    if (this.xvel != 0) {
        this.faceDir = this.xvel < 0 ? "left" : "right";
    }
}

/**
 * determine whether or not the player is next to a wall in the specified direction
 * @param dir: the direction on the x axis in which to check for a wall
 * @returns whether or not the player is next to a wall in the specified direction
 */
Player.prototype.nextToWall = function(dir) {
    this.x += (dir == "left" ? -1 : 1);
    let wallFound = false;
    for (let i = 0; i < activeRoom.tiles.length; ++i) {
        if (this.collide(activeRoom.tiles[i])) {
            wallFound = true;
            break;
        }
    }
    this.x -= (dir == "left" ? -1 : 1);
    return wallFound
}

/**
 * resolve any post-movement collisions on the x axis, potentially transitioning to wall slide state
 */
Player.prototype.evaluateHorizontalCollisions = function() {
    let colResolved = this.moveOutsideCollisions(true,-Math.sign(this.xvel));
    if (colResolved) {
        this.wallDir = this.xvel < 0 ? "left" : "right"
        this.wallJumpVelocityTimer = 0;
        this.xvel = 0;
        this.dashTimer = 0;
    }
    
    //wall slide if we move into a wall while holding the corresponding directional button, or if we're already sliding on a wall with 0 velocity
    this.wallSliding = !this.grounded && ((colResolved && (this.wallDir == "right" && keysDown["D"] || this.wallDir == "left" && keysDown["A"])) || 
    (this.wallSliding && (this.xvel == 0) && this.nextToWall(this.wallDir)));
    if (this.wallSliding) {
        this.xvel = 0;
        this.faceDir = (this.wallDir == "left" ? "right" : "left");
        //spawn wall particles
        if (this.yvel != 0) {
            this.spawnParticles(10,this.cx() - images[this.imgName].width/2 * (this.wallDir == "left" ? 1 : -1),this.cx() - images[this.imgName].width/4 * (this.wallDir == "left" ? 1 : -1),
            this.cy() -  images[this.imgName].height/2, this.cy() +  images[this.imgName].height/2, 15,"255,255,255",4,0,this.yvel/16);
        }
    }
}

/**
 * apply gravity to vertical movement, then update y position
 */
Player.prototype.updateVerticalMovement = function() {
    if (this.dashTimer == 0) {
        //apply gravity (unbounded rising speed with 1/2 reduction on button hold buffer, bounded falling speed)
        this.yvel = clamp(this.yvel + this.yAccel * (keysDown["B"] && this.jumpHoldTimer > 0 ? .2 : 1), -Number.MAX_VALUE, (this.wallSliding ? this.yVelSlide: this.yVelMax));
        if (this.wallSliding) {
            if (keysDown["W"]) this.yvel = -this.wallClimbVel;
            else if (keysDown["S"]) this.yvel = this.wallClimbVel;
        }
    }
    //apply resulting y velocity to y coordinate
    this.y += this.yvel;
    //check if we just climbed up and over the wall
    if (this.yvel < 0 && this.wallSliding && keysDown["W"] && !(this.nextToWall(this.wallDir))) {
        this.wallSliding = false;
        this.yvel = 0;
        ++this.y;
        while (!this.nextToWall(this.wallDir)) {
            ++this.y;
        }
        --this.y;
    }
}

/**
 * resolve any post-movement collisions on the y axis
 */
Player.prototype.evaluateVerticalCollisions = function() {
    if (this.moveOutsideCollisions(false,-Math.sign(this.yvel))) {
        this.yvel = 0;
    }
}

/**
 * checks whether the player is grounded. if they are, reset yvel and toggle grounded flag
 */
Player.prototype.updateGrounded = function() {
    //toggle grounded off and move down one pixel to see if the floor is below us
    let wasGrounded = this.grounded;
    this.grounded = false;
    this.y += 1;
    for (let i = 0; i < activeRoom.tiles.length; ++i) {
        if (tileProperties[activeRoom.tiles[i].type].state == tileStates.solid && this.collide(activeRoom.tiles[i])) {
            this.grounded = true;
            this.yvel = 0;
            break;
        }
    }
    //move back up
    this.y -= 1;
    
    if (this.grounded && !wasGrounded) {
        //spawn land particles
        this.spawnParticles(10,this.cx() - images[this.imgName].width/2,this.cx() + images[this.imgName].width/2,
        this.cy(), this.cy() +  images[this.imgName].height/2, 30,"255,255,255",8,this.xvel/16,.2);
    }
}


/**
 * evaluate the player in the grounded or walljump state, processing potential jump commands
 */
Player.prototype.evaluateGroundedOptions = function() {
    if (this.grounded || this.wallSliding) {
        if (this.dashTimer == 0) {
            this.canDash = true;
        }
        //reset walljump timer when grounded or wall sliding
        this.wallJumpVelocityTimer = 0;
        if (keysDown["B"] && this.jumpBuffer > 0) {
            //reset jump buffer on successful jump
            this.jumpBuffer = 0;
            this.jumpHoldTimer = this.jumpMaxHoldTimer;
            //jump
            if (this.grounded) {
                this.yvel = -this.jumpVel;
            }
            //walljump
            else {
                this.yvel = -this.wallJumpYVel;
                this.xvel = (this.wallDir == "left" ? 1 : -1) * this.walljumpXVel;
                this.wallJumpVelocityTimer = this.wallJumpMaxVelocityTimer;
            }
            this.grounded = false;
            this.wallSliding = false;
            //spawn jump particles
            this.spawnParticles(10,this.cx() - images[this.imgName].width/2,this.cx() + images[this.imgName].width/2,
            this.cy() - (this.wallJumpVelocityTimer==0 ? 0 : images[this.imgName].height/2), this.cy() +  images[this.imgName].height/2, 30,"255,255,255",8,this.xvel/16,-.2);
        }
    }
}

/**
 * check if the player has fallen below the map; if so, kill the player
 */
Player.prototype.checkBelowMap = function() {
    for (let i = 0; i < activeRoom.tiles.length; ++i) {
        if (activeRoom.tiles[i].y > (this.y-100)) {
            return;
        }
    }
    this.die();
}

/**
 * kill the player
 */
Player.prototype.die = function() {
    this.x = this.startX;
    this.y = this.startY;
}

/**
 * evaluate the player's dash status
 */
Player.prototype.evaluateDash = function() {
    if (this.canDash && this.dashTimer == 0 && (keysPressed["M"])) {
        if (this.wallSliding || (keysDown["A"] && keysDown["D"])) {
            this.dashDir = this.faceDir;
        }
        else {
            this.dashDir = keysDown["A"] ? "left" : (keysDown["D"] ? "right" : this.faceDir);
        }
        this.dashTimer = this.dashMaxTimer;
        this.canDash = false;
        this.wallJumpVelocityTimer = 0;        
    }
}

/**
 * spawn the desired number of particles with the specified attributes
 * @param numParts: the number of particles to spawn
 * @param minX: the minimum x position for the particles
 * @param maxX: the maximum x position for the particles
 * @param minY: the minimum y position for the particles
 * @param maxY: the maximum y position for the particles
 * @param life: the frame duration of the particles
 * @param color: the rgb color of the particles
 * @param radius: the radius of the particles
 * @param xChange: the amount by which to change each particle's x coordinate each frame
 * @param yChange: the amount by which to change each particle's y coordinate each frame
 */
Player.prototype.spawnParticles = function(numParts,minX,maxX,minY,maxY,life,color,radius,xChange,yChange) {
        for (let i = 0; i < numParts; ++i) {
            rmPlay.addParticle(new Particle(getRandomInt(minX,maxX),getRandomInt(minY,maxY),life,color,radius,xChange,yChange,true));
        }
}

/**
 * update the player's dash
 */
Player.prototype.updateDash = function() {
    if (this.dashTimer > 0) {
        this.xvel = (this.dashDir == "left" ? -1 : 1) * this.dashVel;
        this.yvel = 0;
        //spawn dash particles
        this.spawnParticles(10,this.cx() - images[this.imgName].width/2,this.cx() + images[this.imgName].width/2,
        this.cy() -  images[this.imgName].height/2, this.cy() +  images[this.imgName].height/2, 30,"255,255,255",2,this.xvel/16,0);
    }
}

/**
 * update the player character
 */
Player.prototype.update = function() {
    this.tickTimers();
    //reset jump buffer on jump key press
    if (keysPressed["B"]) this.jumpBuffer = this.jumpMaxBuffer;
    this.updateHorizontalMovement();
    this.evaluateHorizontalCollisions();
    this.updateVerticalMovement();
    this.evaluateVerticalCollisions();
    this.updateGrounded();
    //reset jump hold timer if we're no longer moving up
    if (this.yvel >= 0) this.jumpHoldTimer =  0;
    this.evaluateDash();
    this.updateDash();
    this.evaluateGroundedOptions();
    this.checkBelowMap();
}

/**
 * render the player facing in the correct direction
 * @param cnv: the canvas on which to render
 */
Player.prototype.render = function(ctx) {
    drawCentered(this.imgName,ctx,this.cx(),this.cy(),this.rot,this.faceDir == "left");
}