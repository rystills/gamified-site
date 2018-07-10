/**
 * Room class; holds sets of objects for updating and rendering
 */
function Room() {
    //store all objects in two lists; one with update order, and another with render order
    this.updateObjects = [];
    this.renderObjects = [];
    this.particles = []
    this.tiles = [];
}

/**
 * add an object to this room
 * @param obj: the GameObject to add 
 */
Room.prototype.addObject = function(obj) {
    this.updateObjects.splice(binarySearch(this.updateObjects,obj,"updateOrder"),0,obj);
    this.renderObjects.splice(binarySearch(this.renderObjects,obj,"renderOrder"),0,obj);
}

/**
 * remove an object from this room
 * @param obj: the object to remove
 */
Room.prototype.removeObject = function(obj) {
    this.updateObjects.splice(this.updateOjects.indexOf(obj),1);
    this.renderObjects.splice(this.renderObjects.indexOf(obj),1);
}

/**
 * add a particle to this room
 * @param part: the particle to add 
 */
Room.prototype.addParticle = function(part) {
    this.particles.push(part);
}

/**
 * remove a particle from this room
 * @param part: the particle to remove
 */
Room.prototype.removeParticle = function(part) {
    this.particles.splice(this.particles.indexOf(part),1);
}

/**
 * add a tile to this room
 * @param tile: the tile to add 
 */
Room.prototype.addTile = function(tile) {
    this.tiles.push(tile);
}

/**
 * remove a tile from this room
 * @param tile: the tile to remove
 */
Room.prototype.removeTile = function(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1);
}

/**
 * update all objects in order
 */
Room.prototype.update = function() {
    //update tiles
    for (let i = 0; i < this.tiles.length; ++i) {
        this.tiles[i].update();
    }
    //update objects
    for (let i = 0; i < this.updateObjects.length; ++i) {
        this.updateObjects[i].update();
    }
    //update particles, removing particles once they've expired
	for (let i = 0; i < this.particles.length; ++i) {
		this.particles[i].update();
		if (this.particles[i].life == 0) {
			this.particles.splice(i,1);
			--i;
		}
	}

    
}
/**
 * render all objects in order
 */
Room.prototype.render = function() {
    //render tiles
    for (let i = 0; i < this.tiles.length; ++i) {
        this.tiles[i].render(ctx);
    }
    //render objects
    for (let i = 0; i < this.renderObjects.length; ++i) {
        this.renderObjects[i].render(ctx);
    }
    //render particles
    for (let i = 0; i < this.particles.length; ++i) {
        this.particles[i].render(ctx);
    }
}