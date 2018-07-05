tileTypes = new Enum("grassTop","grassLeft","grassRight","dirt","water","lava");
tileStates = new Enum("solid","liquid","lava","intangible");
tileProperties = {};
tileProperties[tileTypes.grassTop] = {imgName:"ground",state:tileStates.solid};

/**
 * Tile class: describes a single tile in the world
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 * @param type: the tile type for this instance
 */
makeChild("Tile","GameObject");
function Tile(x,y,type) {
    this.type = type;
    GameObject.call(this,x,y,tileProperties[this.type].imgName);
}