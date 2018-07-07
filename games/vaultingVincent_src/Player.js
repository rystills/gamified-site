/**
 * Player class: describes the playable charaacter
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 */
makeChild("Player","GameObject");
function Player(x,y) {
    GameObject.call(this,x,y,"player");
    //movement properties
    this.yvel = 0;
    this.xvel = 0;
    this.xAccelGround = 1;
    this.xAccelAir = .7;
    this.xvelMax = 6;
    this.yAccel = .85;
    this.yVelMax = 10;
    this.jumpVel = 11;
    this.wallJumpYVel = 9;
    this.walljumpXVel = 6;
    this.xDecelGround = 1;
    this.xDecelAir = 0;
    this.grounded = false;
    this.wallSliding = false;
    this.wallDir = "left";
    this.yVelSlide = 1;
    
    this.wallJumpMaxVelocityTimer = 10;
    this.wallJumpVelocityTimer = 0;
    this.jumpMaxHoldTimer = 10;
    this.jumpHoldTimer = 0;
    this.jumpMaxBuffer = 15;
    this.jumpBuffer = 0;
    this.jumpPressed = false;

    this.canDash = true;
    this.dashDir = "left";
    this.dashMaxBuffer = 12;
    this.dashBuffer = 0;
    this.dashMaxTimer = 10;
    this.dashTimer = 0;
    this.dashVel = 12;
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
        for (let i = 0; i < tiles.length; ++i) {
            if (tileProperties[tiles[i].type].state == tileStates.solid && this.collide(tiles[i])) {
                collisionResolved = true;
                this.translate(isXAxis,(isXAxis ? this.intersect(tiles[i]).x : this.intersect(tiles[i]).y) * moveSign);
            }
        }
    }
    return collisionResolved;
}

/**
 * tick all timers down by one frame
 */
Player.prototype.tickTimers = function() {
    this.jumpHoldTimer = keysDown["W"] ? clamp(this.jumpHoldTimer - 1, 0, this.jumpMaxHoldTimer) : 0;
    this.jumpBuffer = clamp(this.jumpBuffer-1, 0, this.jumpMaxBuffer);
    this.wallJumpVelocityTimer = clamp(this.wallJumpVelocityTimer - 1, 0, this.wallJumpMaxVelocityTimer);
    this.dashTimer = clamp(this.dashTimer - 1, 0, this.dashMaxTimer);
    this.dashBuffer = clamp(this.dashBuffer - 1, 0, this.dashMaxBuffer);
}

/**
 * apply acceleration and deceleration to horizontal movement, then update x position
 */
Player.prototype.updateHorizontalMovement = function() {
    if (this.wallJumpVelocityTimer == 0 && this.dashTimer == 0) {
        //horizontal movement (when not locked out by walljump timer)
        if (keysDown["A"] || keysDown["D"]) {
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
}

/**
 * determine whether or not the player is next to a wall in the specified direction
 * @param dir: the direction on the x axis in which to check for a wall
 * @returns whether or not the player is next to a wall in the specified direction
 */
Player.prototype.nextToWall = function(dir) {
    this.x += (dir == "left" ? -1 : 1);
    let wallFound = false;
    for (let i = 0; i < tiles.length; ++i) {
        if (this.collide(tiles[i])) {
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
    //stop wall sliding if we press down
    if (keysDown["S"]) {
        this.wallSliding = false;
    }
    else {
        //wall slide if we move into a wall while holding the corresponding directional button, or if we're already sliding on a wall with 0 velocity
        this.wallSliding = !this.grounded && ((colResolved && (this.wallDir == "right" && keysDown["D"] || this.wallDir == "left" && keysDown["A"])) || 
        (this.wallSliding && (this.xvel == 0) && this.nextToWall(this.wallDir)));
        if (this.wallSliding) {
            this.xvel = 0;
            this.yvel = clamp(this.yvel,-Number.MAX_VALUE,this.yVelSlide);
            //spawn wall particles
            let cx = this.cx();
            let cy = this.cy();
            let hw = images[this.imgName].width/2;
            let hh = images[this.imgName].height/2;
            let partYChange = this.yvel/16;
            for (let i = 0; i < 10; ++i) {
                particles.push(new Particle(getRandomInt(cx-hw,cx+hw),getRandomInt(cy-hh,cy+hh),15,"200,255,0",4,0,partYChange,true));
            }
        }
    }
}

/**
 * apply gravity to vertical movement, then update y position
 */
Player.prototype.updateVerticalMovement = function() {
    if (this.dashTimer == 0) {
        //apply gravity (unbounded rising speed with 1/2 reduction on button hold buffer, bounded falling speed)
        this.yvel = clamp(this.yvel + this.yAccel * (keysDown["W"] && this.jumpHoldTimer > 0 ? .2 : 1), -Number.MAX_VALUE, this.yVelMax);
        //apply resulting y velocity to y coordinate
        this.y += this.yvel;
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
    for (let i = 0; i < tiles.length; ++i) {
        if (tileProperties[tiles[i].type].state == tileStates.solid && this.collide(tiles[i])) {
            this.grounded = true;
            this.canDash = true;
            this.yvel = 0;
            break;
        }
    }
    //move back up
    this.y -= 1;
    
    if (this.grounded && !wasGrounded) {
        //spawn land particles
        let cx = this.cx();
        let cy = this.cy();
        let hw = images[this.imgName].width/2;
        let hh = images[this.imgName].height/2;
        let partXChange = this.xvel/16;
        for (let i = 0; i < 10; ++i) {
            particles.push(new Particle(getRandomInt(cx-hw,cx+hw),getRandomInt(cy,cy+hh),30,"255,255,255",8,partXChange,.2,true));
        }
    }
}


/**
 * evaluate the player in the grounded or walljump state, processing potential jump commands
 */
Player.prototype.evaluateGroundedOptions = function() {
    if (this.grounded || this.wallSliding) {
        //reset walljump timer when grounded or wall sliding
        this.wallJumpVelocityTimer = 0;
        if (keysDown["W"] && this.jumpBuffer > 0) {
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
            let cx = this.cx();
            let cy = this.cy();
            let hw = images[this.imgName].width/2;
            let hh = images[this.imgName].height/2;
            let partXChange = this.xvel/16;
            for (let i = 0; i < 10; ++i) {
                particles.push(new Particle(getRandomInt(cx-hw,cx+hw),getRandomInt(cy-(this.wallJumpVelocityTimer==0 ? 0 : hh),cy+hh),30,"255,255,255",8,partXChange,-.2,true));
            }
        }
    }
}

/**
 * evaluate the player's dash status
 */
Player.prototype.evaluateDash = function() {
    if (this.canDash && this.dashTimer == 0 && (keysPressed["A"] || keysPressed["D"])) {
        //first key press; reset press buffer and set dash direction
        if (this.dashBuffer == 0) {
            this.dashBuffer = this.dashMaxBuffer;
            this.dashDir = keysPressed["A"] ? "left" : "right";
        }
        //second key press; trigger a dash if we pressed the same direction as last time
        else {
            //same direction; activate dash
            if ((keysPressed["A"] && this.dashDir == "left") || (keysPressed["D"] && this.dashDir == "right")) {
                this.dashBuffer = 0;
                this.dashTimer = this.dashMaxTimer;
                this.canDash = false;
                this.wallJumpVelocityTimer = 0;
            }
            //different key press
            else {
                this.dashBuffer = this.dashMaxBuffer;
                this.dashDir = keysPressed["A"] ? "left" : "right";
            }
        }
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
        let cx = this.cx();
        let cy = this.cy();
        let hw = images[this.imgName].width/2;
        let hh = images[this.imgName].height/2;
        let partXChange = this.xvel/16;
        for (let i = 0; i < 10; ++i) {
            particles.push(new Particle(getRandomInt(cx-hw,cx+hw),getRandomInt(cy-hh,cy+hh),30,"255,255,255",2,partXChange,0,true));
        }
    }
}

/**
 * update the player character
 */
Player.prototype.update = function() {
    this.tickTimers();
    //reset jump buffer on jump key press
    if (keysPressed["W"]) this.jumpBuffer = this.jumpMaxBuffer;
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
}