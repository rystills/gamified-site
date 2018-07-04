/**
 * Player class: describes the playable charaacter
 * @param x: the starting center x coordinate
 * @param y: the starting center y coordinate
 */
makeChild("Player","GameObject");
function Player(x,y) {
    GameObject.call(this,x,y,"player");
}

/**
 * update the player character
 */
Player.prototype.update = function() {
    if (keyStates["A"]) {
        this.x -= 2;
    }
    if (keyStates["D"]) {
        this.x += 2;
    }
}