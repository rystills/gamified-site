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
    this.xAccelAir = .5;
    this.xvelMax = 5;
    this.yAccel = .4;
    this.yVelMax = 10;
    this.jumpVel = 11;
    this.xDecelGround = 1;
    this.xDecelAir = 0;
    let grounded = false;
}

/**
 * move outside of all rect collisions on the specified axis
 * @param isXAxis: whether we wish to move on the x axis (true), or the y axis (false)
 * @param sign: the direction in which we wish to move (-1 or 1, given by Math.sign)
 * @param collidingObject: object to move outside of collision with. If left blank, all solid tiles are checked for collision instead
 */
Player.prototype.moveOutsideCollisions = function(isXAxis, moveSign, collidingObject = null) {
    let collisionResolved = false;
    if (collidingObject != null) {
        if (this.collide(collidingObject)) {
            collisionResolved = true;
            if (isXAxis) {
                this.x += this.intersect(collidingObject).x * moveSign;
            }
            else {
                this.y += this.intersect(collidingObject).y * moveSign;
            }
        }
    }
    else {
        for (let i = 0; i < tiles.length; ++i) {
            if (tileProperties[tiles[i].type].state == tileStates.solid && this.collide(tiles[i])) {
                collisionResolved = true;
                if (isXAxis) {
                    this.x += this.intersect(tiles[i]).x * moveSign;
                }
                else {
                    this.y += this.intersect(tiles[i]).y * moveSign;
                }
            }
        }
    }
    return collisionResolved;
}

/**
 * checks whether the player is grounded. if they are, reset yvel and toggle grounded flag
 */
Player.prototype.checkGrounded = function() {
    //toggle grounded off and move down one pixel to see if the floor is below us
    this.grounded = false;
    this.y += 1;
    for (let i = 0; i < tiles.length; ++i) {
        if (tileProperties[tiles[i].type].state == tileStates.solid && this.collide(tiles[i])) {
            this.grounded = true;
            break;
        }
    }
    //move back up and reset velocity if we are indeed grounded
    this.y -= 1;
    if (this.grounded) {
        this.yvel = 0;
    }
}

/**
 * update the player character
 */
Player.prototype.update = function() {
    //horizontal movement
    if (keyStates["A"] || keyStates["D"]) {
        this.xvel = clamp(this.xvel-(this.grounded ? this.xAccelGround : this.xAccelAir)*(keyStates["D"] ? -1 : 1), -this.xvelMax, this.xvelMax);
    }
    //horizontal deceleration
    else {
        let xDecel = this.grounded ? this.xDecelGround : this.xDecelAir;
        this.xvel -= Math.abs(this.xvel) <= (xDecel) ? this.xvel : Math.sign(this.xvel) * (xDecel);
    }

    //apply final x velocity, stopping if we hit something
    this.x += this.xvel;
    if (this.moveOutsideCollisions(true,-Math.sign(this.xvel))) {
        this.xvel = 0;
    }
    
    //vertical movement
    //apply gravity (unbounded rising speed, bounded falling speed)
    this.yvel = clamp(this.yvel + this.yAccel, -Number.MAX_VALUE, this.yVelMax);

    //apply final y velocity, stopping if we hit something
    this.y += this.yvel;
    if (this.moveOutsideCollisions(false,-Math.sign(this.yvel))) {
        this.yvel = 0;
    }

    //update grounded state + allow jumping
    this.checkGrounded();
    if (this.grounded) {
        if (keyStates["W"]) {
            //jump
            this.yvel = -this.jumpVel;
            this.grounded = false;
        }
    }
}