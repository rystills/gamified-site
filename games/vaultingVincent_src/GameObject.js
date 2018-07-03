/**
 * check if this GameObject is colliding with another GameObject via AABB
 * @param o: the other object we wish to check for collision with
 * @returns whethr or not we are colliding with GameObject o
 */
GameObject.prototype.collide = function(o) {
    return collisionRect(this.cx(),this.cy(),images[this.imgName].width,images[this.imgName].height,
        o.cx(),o.cy(),images[o.imgName].width,images[o.imgName].height);
}

/**
 * calculate our center x coordinate
 * @returns our center x coordinate
 */
GameObject.prototype.cx = function() {
    return this.x + images[this.imgName].width/2;
}

/**
 * calculate our center y coordinate
 * @returns our center y coordinate
 */
GameObject.prototype.cy = function() {
    return this.y + images[this.imgName].height/2;
}

/**
 * GameObject class: serves as the base class for all objects which will be represented in-game
 * @param {*} x: the starting x coordinate
 * @param {*} y: the starting y coordinate
 * @param {*} rot: the starting rotation (in degrees)
 * @param {*} imgName: the name of our starting image (used for images dict lookup)
 */
function GameObject(x,y,rot,imgName) {
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.imgName = imgName;
}