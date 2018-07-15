placeTypes = new Enum();
placeProperties = {};
for (let i = 0; i < tileTypes.all.length; ++i) {
    placeTypes.add(tileTypes.all[i]);
    placeProperties[i] = {imgName: tileProperties[i].imgName};
}
/**
 * the Placer allows the user to add or remove elements in the level creator
 * @param ctx: the context to which the placer belongs
 */
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
    this.active = true;
}

/**
 * update the placer
 */
Placer.prototype.update = function() {
    if (!this.active) {
        return;
    }
}

/**
 * render the placer
 */
Placer.prototype.render = function() {
    if (!this.active) {
        return;
    }
    this.ctx.drawImage(images[placeProperties[this.type].imgName], Math.floor((activeRoom.scrollX + cnv.mousePos.x)/gridSize)*gridSize,
    Math.floor((activeRoom.scrollY + cnv.mousePos.y)/gridSize)*gridSize);
}