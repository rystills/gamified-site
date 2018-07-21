/**
 * Room class; holds sets of objects for updating and rendering
 */
function Room(clearColor) {
    //store all objects in two lists; one with update order, and another with render order
    this.updateObjects = [];
    this.renderObjects = [];
    this.particles = []
    this.tiles = {};
    this.tileList = [];
    this.ui = [];
    this.clearColor = clearColor;
    this.running = false;
    this.scrollX = 0;
    this.scrollY = 0;
}

/**
 * set whether or not this room should be running
 * @param running: whether this room should be running or not; if not specified, running is simply toggled
 */
Room.prototype.setRunning = function(running) {
    if (running != null) {
        this.running = running;
    }
    else {
        this.running = !this.running;
    }
    //reset everything
    for (let i = 0; i < this.updateObjects.length; ++i) {
        this.updateObjects[i].reset();
    }
    for (let i = 0; i < this.tiles.length; ++i) {
        this.tiles[i].reset();
    }
    this.particles.length = 0;
}

/**
 * add an object to this room
 * @param obj: the GameObject to add 
 * @returns the newly added object
 */
Room.prototype.addObject = function(obj) {
    this.updateObjects.splice(binarySearch(this.updateObjects,obj,"updateOrder"),0,obj);
    this.renderObjects.splice(binarySearch(this.renderObjects,obj,"renderOrder"),0,obj);
    return obj;
}

/**
 * remove an object from this room
 * @param obj: the object to remove
 * @returns the newly removed object
 */
Room.prototype.removeObject = function(obj) {
    this.updateObjects.splice(this.updateObjects.indexOf(obj),1);
    this.renderObjects.splice(this.renderObjects.indexOf(obj),1);
    return obj;
}

/**
 * add a particle to this room
 * @param part: the particle to add 
 * @returns the newly added particle
 */
Room.prototype.addParticle = function(part) {
    this.particles.push(part);
    return part;
}

/**
 * remove a particle from this room
 * @param part: the particle to remove
 * @returns the newly removed particle
 */
Room.prototype.removeParticle = function(part) {
    this.particles.splice(this.particles.indexOf(part),1);
    return part;
}

/**
 * add a tile to this room
 * @param tile: the tile to add 
 * @param x: the x index of of the tile on the grid
 * @param y: the y index of the tile on the grid
 * @returns the newly added tile
 */
Room.prototype.addTile = function(tile,x,y) {
    if (this.tiles[x+","+y] == null) {
        this.tiles[x+","+y] = tile;
        this.tileList.push(tile);
    }
    return tile;
}

/**
 * remove a tile from this room
 * @param tile: the tile to remove
 * @returns the newly removed tile
 */
Room.prototype.removeTile = function(tile) {
    this.tiles[Math.floor(tile.x/gridSize)+","+Math.floor(tile.y/gridSize)] = null;
    this.tileList.splice(this.tileList.indexOf(tile),1);
    return tile;
}


/**
 * remove a tile from this room
 * @param x: the x index of of the tile on the grid
 * @param y: the y index of the tile on the grid
 * @returns the newly removed tile
 */
Room.prototype.removeTilePos = function(x,y) {
    let tile = tiles[x+","+y];
    if (tile != null) {
        tiles[x+","+y] = null;
        this.tileList.splice(this.tileList.indexOf(tile),1);
    }
    return tile;
}

/**
 * add a UI element to this room
 * @param uiObj: the ui element to add
 * @returns the newly added ui object
 */
Room.prototype.addUI = function(uiObj) {
    this.ui.push(uiObj);
    return uiObj;
}

/**
 * remove a ui element from this room
 * @param uiObj: the ui element to remove
 * @returns the newly removed ui object
 */
Room.prototype.removeUI = function(uiObj) {
    this.ui.splice(this.ui.indexOf(uiObj),1);
    return uiObj;
}

/**
 * update all objects in order
 */
Room.prototype.update = function() {
    //non-ui elements are ignored when the layer is active but not running (used for seamless level creator integration)
    if (this.running) {
        //update tiles
        for (let i = 0; i < this.tileList.length; ++i) {
            this.tileList[i].update();
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
    //update ui
    for (let i = 0; i < this.ui.length; ++i) {
        this.ui[i].update();
    }
}
/**
 * render all objects in order
 */
Room.prototype.render = function() {
    //clear the screen first
    ctx.fillStyle=this.clearColor;
	ctx.fillRect(0,0,cnv.width,cnv.height);
	
	//HUD canvas
	uictx.fillStyle="rgb(0,0,0)";
    uictx.fillRect(0,0,uicnv.width,uicnv.height);

    //offset by scroll value
    ctx.save();
    ctx.translate(-this.scrollX,-this.scrollY);
    
    //render tiles
    for (let i = 0; i < this.tileList.length; ++i) {
        this.tileList[i].render();
    }
    
    //render objects
    for (let i = 0; i < this.renderObjects.length; ++i) {
        this.renderObjects[i].render();
    }
    //render particles
    for (let i = 0; i < this.particles.length; ++i) {
        this.particles[i].render();
    }

    //render UI
    for (let i = 0; i < this.ui.length; ++i) {
        this.ui[i].render();
    }

    //reset offset
    ctx.restore();
}