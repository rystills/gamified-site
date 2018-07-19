/**
 * Grid class: renders a grid to the screen and controls scrolling in playtest mode
 * @param cnv: the canvas on which to render
 */
makeChild("Grid","GameObject");
function Grid(cnv) { 
    this.cnv = cnv;
    this.ctx = this.cnv.getContext("2d");
    this.scrollBuffer = 100;
    this.scrollMaxSpeed = 12;
    this.mousePrev = this.cnv.mousePos;
}

/**
 * scroll the screen when the mouse is near the window edge
 */
Grid.prototype.update = function() {
    //check screen scroll
    this.checkScroll();
}

/**
 * check update the grid scroll
 */
Grid.prototype.checkScroll = function() {
    if (activeRoom.running) {
        //keep player in center of camera
        activeRoom.scrollX = Math.round(player.cx() - this.cnv.width/2);
        activeRoom.scrollY = Math.round(player.cy() - this.cnv.height/2);
    }
    else {
        if (mouseDownRight) {
            activeRoom.scrollX -= this.cnv.mousePos.x - this.mousePrev.x;
            activeRoom.scrollY -= this.cnv.mousePos.y - this.mousePrev.y;
        }
    }
    this.mousePrev = this.cnv.mousePos;
}

/**
 * render the grid onto its canvas
 */
Grid.prototype.render = function() {
    //only draw the grid in create mode
    if (activeRoom.running) {
        return;
    }
    this.ctx.strokeStype = "rgb(0,0,0)";
    this.ctx.beginPath();
    let startX = Math.floor(Math.floor(activeRoom.scrollX / gridSize) * gridSize);
    let startY = Math.floor(Math.floor(activeRoom.scrollY / gridSize) * gridSize);
    for (let i = 0; i < (gridSize+this.cnv.width) / gridSize; ++i) {
        this.ctx.moveTo(startX + i*gridSize,activeRoom.scrollY);
        this.ctx.lineTo(startX + i*gridSize,activeRoom.scrollY + this.cnv.height);
        this.ctx.stroke();
    }
    for (let i = 0; i < (gridSize+this.cnv.height) / gridSize; ++i) {
        this.ctx.moveTo(activeRoom.scrollX,startY + i*gridSize);
        this.ctx.lineTo(activeRoom.scrollX+this.cnv.width,startY + i*gridSize);
        this.ctx.stroke();
    }
}