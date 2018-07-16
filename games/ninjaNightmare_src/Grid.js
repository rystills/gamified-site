/**
 * Grid class: renders a grid to the screen and controls scrolling in playtest mode
 * @param cnv: the canvas on which to render
 */
makeChild("Grid","GameObject");
function Grid(cnv) { 
    this.cnv = cnv;
    this.ctx = this.cnv.getContext("2d");
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