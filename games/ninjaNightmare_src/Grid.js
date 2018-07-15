/**
 * Grid class: renders a grid to the screen while in playtest mode
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
    for (let i = 0; i < this.cnv.width / gridSize; ++i) {
        this.ctx.moveTo(i*gridSize,0);
        this.ctx.lineTo(i*gridSize,this.cnv.height);
        this.ctx.stroke();
    }
    for (let i = 0; i < this.cnv.height / gridSize; ++i) {
        this.ctx.moveTo(0,i*gridSize);
        this.ctx.lineTo(this.cnv.width,i*gridSize);
        this.ctx.stroke();
    }
}