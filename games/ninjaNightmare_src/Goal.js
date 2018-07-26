/**
 * the Goal is the location the player must reach in order to win
 * @param ctx: the context to which the goal belongs
 */
makeChild("Goal","GameObject");
function Goal(x,y,ctx) {
    GameObject.call(this,x,y,"goal",0,-1000,ctx);
}