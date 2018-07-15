/**
 * the Placer allows the user to add or remove elements in the level creator
 * @param ctx: the context to which the placer belongs
 */
function Placer(ctx) {
    this.ctx = ctx;
    placeTypes = new Enum();
    for (let i = 0; i < tileTypes.all.length; ++i) {
        placeTypes.add(tileTypes.all[i]);
    }
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
    return;
}