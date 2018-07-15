makeChild("ScrollIndicator","TextBox");
/**
 * ScrollIndicator class; defines a text element which updates each frame to display the active room's scroll coordinates
 * @param x: the starting topleft x coordinate
 * @param y: the starting topleft y coordinate
 * @param ctx: the context to which this ScrollIndicator belongs
*/
function ScrollIndicator(x,y,ctx) {
    TextBox.call(this,x,y,false,"","rgb(255,255,255)",24,ctx);
}

/**
 * update the scroll indicator, reflecting the current scroll values
 */
ScrollIndicator.prototype.update = function() {
    this.text = "Scroll: " + activeRoom.scrollX + ", " + activeRoom.scrollY;
}