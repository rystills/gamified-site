/**
 * clear each canvas to a predetermined fillcolor, preparing it for a fresh render
 */
function clearScreen() {
	//main canvas
	ctx.fillStyle="turquoise";
	ctx.fillRect(0,0,cnv.width,cnv.height);
	
	//HUD canvas
	uictx.fillStyle="rgb(0,0,0)";
	uictx.fillRect(0,0,uicnv.width,uicnv.height);
}

/**
 * render all objects and HUD elements
 */
function render() {
	//clear all canvases for a fresh render
	clearScreen();
	activeRoom.render();
	//toggle off any one-frame event indicators at the end of the update tick
	resetPressedKeys();
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	activeRoom.update();
	//once all updates are out of the way, render the frame
	render();
}

/**
 * initialize a reference to each of our canvases and contexts
 */
function initCanvases() {
	//create appropriately named references to all of our canvases
	cnv = document.getElementById("cnv");
	ctx = cnv.getContext("2d");
	
	uicnv = document.getElementById("uicnv");
	uictx = uicnv.getContext("2d");
}

/**
 * load the asset loader, which will load all of our required elements in order
 */
function loadAssets() {
	//setup a global, ordered list of asset files to load
	requiredFiles = [
		"src\\util.js","src\\setupKeyListeners.js", //util functions
		"src\\classes\\Enum.js", "src\\classes\\Button.js", //util classes
		"vaultingVincent_images\\pipes.png", "vaultingVincent_images\\player.png", //images
		"vaultingVincent_src\\GameObject.js","vaultingVincent_src\\Enemy.js", //source files
		"vaultingVincent_src\\Tile.js","vaultingVincent_src\\Particle.js","vaultingVincent_src\\Player.js", //source files
		"vaultingVincent_src\\Room.js", //source files
		];
	
	//manually load the asset loader
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "src\\loadAssets.js";
	script.onload = loadAssets;
	//begin loading the asset loader by appending it to the document head
    document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * initialize all global variables
 */
function initGlobals() {
	//keep a global fps flag for game-speed (although all speeds should use deltaTime)
	fps = 60;
	
	//init global time vars for delta time calculation
	prevTime = Date.now();
	deltaTime = 0;
	totalTime = 0;
	particles = [];

	//demo data
	rmPlay = new Room();
	rmPlay.addObject(new Player(300,300));
	rmPlay.addTile(new Tile(300,400,tileTypes.grassTop));
	rmPlay.addTile(new Tile(300,200,tileTypes.grassTop));
	rmPlay.addTile(new Tile(300,464,tileTypes.grassTop));
	rmPlay.addTile(new Tile(300,528,tileTypes.grassTop));
	rmPlay.addTile(new Tile(236,528,tileTypes.grassTop));
	rmPlay.addTile(new Tile(172,528,tileTypes.grassTop));
	rmPlay.addTile(new Tile(364,528,tileTypes.grassTop));
	rmPlay.addTile(new Tile(428,528,tileTypes.grassTop));
	for (let i = 0; i < 5; ++i) {
		rmPlay.addTile(new Tile(172,528 - 64*i,tileTypes.grassTop));
		rmPlay.addTile(new Tile(428,528 - 64*i,tileTypes.grassTop));
	}
	
	activeRoom = rmPlay;
}

//disallow right-click context menu as right click functionality is often necessary for gameplay
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();