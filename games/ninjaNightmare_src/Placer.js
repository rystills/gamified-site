placeTypes = new Enum();
placeProperties = {};
for (let i = 0; i < tileTypes.all.length; ++i) {
    placeTypes.add(tileTypes.all[i]);
    placeProperties[i] = {imgName: tileProperties[i].imgName};
}

/**
 * the Placer allows the user to add elements in the level creator
 * @param ctx: the context to which the placer belongs
 */
makeChild("Placer","GameObject");
function Placer(cnv) {
    this.cnv = cnv;
    this.ctx = this.cnv.getContext("2d");
    this.active = false;
    this.type = null;
}

/**
 * activate the placer, setting its type to the designated place type
 * @param type: the placeType to set the placer to
 */
Placer.prototype.activate = function(type) {
    this.type = type;
    this.imgName = placeProperties[this.type].imgName;
    this.active = true;
}

/**
 * check whether or not the Placer is currently colliding with anything
 */
Placer.prototype.collisionDetected = function() {
    if (activeRoom.tiles[Math.floor(this.x/gridSize)+","+Math.floor(this.y/gridSize)]) {
        return true;
    }
    for (let i = 0; i < activeRoom.updateObjects.length; ++i) {
        if (this.collide(activeRoom.updateObjects[i])) {
            return true;
        }
    }
    return false;
}

/**
 * update the placer
 */
Placer.prototype.update = function() {
    //deactivate on click off-screen / on UI
    if (mousePressedLeft && !pointInRect(this.cnv.mousePos.x,this.cnv.mousePos.y,this.cnv)) {
        this.active = false;
    }
    if (!this.active || activeRoom.running) {
        return;
    }
    //update position
    this.x = Math.floor((activeRoom.scrollX + this.cnv.mousePos.x)/gridSize)*gridSize;
    this.y = Math.floor((activeRoom.scrollY + this.cnv.mousePos.y)/gridSize)*gridSize;

    //place blocks when left click is held if nothing occupies our current grid space
    if (mouseDownLeft && !this.collisionDetected()) {
        //check whether we are adding a tile or an object
        if (tileTypes[placeTypes[placer.type]] != null) {
            let newTile = activeRoom.addTile(new Tile(this.x,this.y,this.type,this.ctx),Math.floor(this.x/gridSize),Math.floor(this.y/gridSize));
            //alert tile below if it exists
            let belowTile = activeRoom.tiles[Math.floor(this.x/gridSize)+","+Math.floor(this.y/gridSize+1)];
            if (belowTile != null && (belowTile.type == tileTypes.dirt || belowTile.type == tileTypes.grass)) {
                belowTile.setType(tileTypes.dirt);
            }
            //switch to dirt if above tile exists
            let aboveTile = activeRoom.tiles[Math.floor(this.x/gridSize)+","+Math.floor(this.y/gridSize-1)];
            if (aboveTile != null && (aboveTile.type == tileTypes.dirt || aboveTile.type == tileTypes.grass)) {
                newTile.setType(tileTypes.dirt);
            }
        }
        else {
            //objects need to be instantiated individually depending on their type ...
        }
    }
}

/**
 * render the placer
 */
Placer.prototype.render = function() {
    if (!this.active || activeRoom.running) {
        return;
    }
    this.ctx.drawImage(images[this.imgName], this.x,this.y);
}