/**
 * TextBox class; defines a single text element
 * @param x: the starting x coordinate
 * @param y: the starting y coordinate
 * @param isCenter: whether the starting coordinates represent the text top-left (false), or the text center (true)
 * @param text: the text that this object should display
 * @param color: the color of this text
 * @param fontSize: the font size to use when rendering this text
 * @param ctx: the context to which this TextBox belongs
*/
function TextBox(x,y,isCenter,text,color,fontSize,ctx) {
    this.x = x;
    this.y = y;
    this.textAlign = (isCenter ? "center" : "start");
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.ctx = ctx;
}


/**
 * render this TextBox to the provided canvas
 */
TextBox.prototype.render = function() {
    this.ctx.font = this.fontSize + "px Arial";
	this.ctx.fillStyle = this.color;
	this.ctx.textAlign=this.textAlign;
	this.ctx.fillText(this.text,this.x,this.y);
	this.ctx.textAlign="start";
}

/**
 * update this TextBox (this will go unused for most static text)
 */
TextBox.prototype.update = function() {

}