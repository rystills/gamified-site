/**
 * GameObject class: serves as the base class for all objects which will be represented in-game
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 * @param imgName: the name of our starting image (used for images dict lookup)
 * @param updateOrder: how late this object should update
 * @param renderObject: how late this object should render
 * @param ctx: the context to which this GameObject belongs
 * @param rot: the starting rotation (in degrees)
 */
function GameObject(x,y,imgName,updateOrder,RenderOrder,ctx,rot=0) {
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.imgName = imgName;
    this.updateOrder = updateOrder;
    this.RenderOrder = RenderOrder;
    this.ctx = ctx;
}

/**
 * check if this GameObject is colliding with another GameObject via AABB
 * @param o: the other object we wish to check for collision with
 * @returns whethr or not we are colliding with GameObject o
 */
GameObject.prototype.collide = function(o) {
    return collisionRect(this.x,this.y,images[this.imgName].width,images[this.imgName].height,
        o.x,o.y,images[o.imgName].width,images[o.imgName].height);
}

/**
 * get the amount of intersection on each axis between this object and another GameObject via AABB
 * @param o: the other object we wish to check for intersection with
 * @returns the degree of intersection with object o on each axis
 */
GameObject.prototype.intersect = function(o) {
    return intersectRectCenter(this.cx(),this.cy(),images[this.imgName].width,images[this.imgName].height,
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
 * move on the desired axis by the specified amount
 * @param isXAxis: whether we wish to move on the x axis (true) or the y axis (false)
 * @param amt: the amount by which to move
 */
GameObject.prototype.translate = function(isXAxis,amt) {
    if (isXAxis) {
        this.x += amt;
    }
    else {
        this.y += amt;
    }
}

/**
 * calculate our center y coordinate
 * @returns our center y coordinate
 */
GameObject.prototype.cy = function() {
    return this.y + images[this.imgName].height/2;
}

/**
 * render this gameObject to the provided canvas
 */
GameObject.prototype.render = function(ctx) {
    drawCentered(this.imgName,this.ctx,this.cx(),this.cy(),this.rot);
}

/**
 * stub method for children to override
 */
GameObject.prototype.update = function() {

}