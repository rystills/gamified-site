/**
 * update the button's state, activating it in the event of a mouse click
 */
Button.prototype.update = function() {
	if (this.activeFunc != null) {
		this.active = this.activeFunc();
	}
	if (!this.active) {
		this.blendWhiteness = 55;
		return;
	}
	//check mouse button status
	//check if mouse is on this button 
	let mousing = pointInRect(this.canvas.mousePos.x,this.canvas.mousePos.y,this,true);
	if (mousing) {
		//if mouse button was just pressed on us, toggle pressed on
		if (mousePressedLeft) {
			this.pressed = true;
		}
		
		//if mouse button was just released on us, trigger a press 
		if (!mouseDownLeft && this.pressed) {
			//run our function, optionally passing in our argument if it has been set, and passing in a reference to this button as the final arg
			restartSound(sounds["confirm"]);
			if (this.arg == null) {
				this.function(this);
			}
			else {
				this.function(this.arg,this);
			}
		}

	}
	
	//set state based off of pressed
	if (this.pressed && mousing) {
		this.state = "press";
	}
	else if (mousing) {
		if (this.state == "neutral") {
			restartSound(sounds["select"]);
		}
		this.state = "hover";
	}
	else {
		this.state = "neutral";
	}

	//if mouse button is not held down, toggle pressed off
	if (!(mouseDownLeft)) {
		this.pressed = false;
	}

	//color blend based off of state
	this.blendWhiteness = 180;
	if (this.state == "press") {
		this.blendWhiteness = 105;
	}
	else if (this.state == "hover") {
		this.blendWhiteness = 255;
	}
}

/**
 * simple class representing a button which can be pressed via a mouse click
 * @param x: the x position of the button's center
 * @param y: the y position of the button's center
 * @param cnv: the canvas to which the button belongs
 * @param text: the text string that should be drawn inside the button
 * @param fontSize: the font size of the button text
 * @param clickFunc: the function to be called when the button is triggered
 * @param clickArg: the argument to be passed in to the button's trigger function
 * @param activeFunc: function which determines whether or not this button is active
 */
function Button(x,y,cnv, text, fontSize, clickFunc,clickArg,activeFunc=null) {
	//initialize state
	this.state = "neutral";
	//whether or not the mouse button is held on us
	this.pressed = false;
	//how brightly to blend our image (state dependent)
	this.blendWhiteness = 0;
	//button label
	this.text = text;
	//button size
	this.fontSize = fontSize;
	//init position
	this.x = x;
	this.y = y;
	//store which canvas we belong to
	this.canvas = cnv;
	//what function we run when pressed
	this.function = clickFunc;
	//what argument we pass into our click function
	this.arg = clickArg;
	
	//init dimensions using canvas and fontSize
	this.canvas.getContext("2d").font = this.fontSize + "px Arial";
	//add a 4 pixel border to the text dimensions to make room for button outline + fill
	this.measureWidth();
	this.height = this.fontSize + 4;
	this.active = true;
	this.activeFunc = activeFunc;
}

/**
 * recalculate this button's width based on the length of its text
 */
Button.prototype.measureWidth = function() {
	this.width = this.canvas.getContext("2d").measureText(this.text).width + 8;
}

/**
 * update this button's text content, optionally updating the button width to match the new text width
 * @param text: the new desired button text
 * @param updateWidth: whether or not to update the width of the button
 */
Button.prototype.updateText = function(text,updateWidth = true) {
	this.text = text;
	this.measureWidth();
}

/**
 * render this button to its specified context (note that Target Test still handles button rendering manually)
 */
Button.prototype.render = function() {
	let btnctx = this.canvas.getContext("2d");
	//fill light blue border color
	btnctx.fillStyle = "rgb(" +  
	Math.round(.15 * this.blendWhiteness) + ", " + 
	Math.round(this.blendWhiteness *.75) + ", " + 
	Math.round(.1 * this.blendWhiteness) + ")";
	btnctx.fillRect(this.x, this.y, this.width,this.height);
	
	//fill blue inner color
	btnctx.fillStyle = "rgb(" + 
	Math.round(this.blendWhiteness *.1) + ", " + 
	Math.round(.15 * this.blendWhiteness) + ", " + 
	Math.round(.75 * this.blendWhiteness) + ")";
	btnctx.fillRect(this.x + 2, this.y + 2, this.width - 4,this.height - 4);
	
	//set the font size and color depending on the button's attributes and state
	btnctx.font = this.fontSize + "px Arial";
	btnctx.fillStyle = "rgb(" + this.blendWhiteness + ", " + this.blendWhiteness + ", " + this.blendWhiteness + ")";
	
	//draw the button label (add slight position offset to account for line spacing)
	btnctx.fillText(this.text,this.x + 4, this.y + this.height/2 + 8);
	uictx.font = "24px Arial";
	uictx.fillStyle = "#FFFFFF";
}