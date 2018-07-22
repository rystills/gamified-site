tileTypes = new Enum("grass","dirt","water","lava");
tileStates = new Enum("solid","liquid","lava","intangible");
tileProperties = {};
tileProperties[tileTypes.grass] = {imgName:"grass",state:tileStates.solid};
tileProperties[tileTypes.dirt] = {imgName:"dirt",state:tileStates.solid};
tileProperties[tileTypes.water] = {imgName:"pipes",state:tileStates.solid};
tileProperties[tileTypes.lava] = {imgName:"pipes",state:tileStates.solid};

/**
 * Tile class: describes a single tile in the world
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 * @param type: the tile type for this instance
 */
makeChild("Tile","GameObject");
function Tile(x,y,type,ctx) {
    this.type = type;
    GameObject.call(this,x,y,tileProperties[this.type].imgName,-1000,-1000,ctx);
}

/**
 * update this Tile's type
 * @param type: the new type to apply to this tile
 */
Tile.prototype.setType = function(type) {
    this.type = type;
    this.imgName = tileProperties[this.type].imgName;
}