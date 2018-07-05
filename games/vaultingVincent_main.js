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
	//render tiles first
	for (let i = 0; i < tiles.length; ++i) {
		tiles[i].render(ctx);
	}
	//render player last
	player.render(ctx);
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	//update tiles first
	for (let i = 0; i < tiles.length; ++i) {
		tiles[i].update();
	}
	//update player last
	player.update();

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
		"vaultingVincent_images\\ground.png", "vaultingVincent_images\\player.png", //images
		"vaultingVincent_src\\GameObject.js","vaultingVincent_src\\Enemy.js", //source files
		"vaultingVincent_src\\Tile.js","vaultingVincent_src\\Player.js" //source files
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

	//demo data
	player = new Player(300,300);
	tiles = [];
	tiles.push(new Tile(300,400,tileTypes.grassTop));
	tiles.push(new Tile(300,464,tileTypes.grassTop));
	tiles.push(new Tile(300,528,tileTypes.grassTop));
	tiles.push(new Tile(236,528,tileTypes.grassTop));
	tiles.push(new Tile(172,528,tileTypes.grassTop));
	tiles.push(new Tile(364,528,tileTypes.grassTop));
	tiles.push(new Tile(428,528,tileTypes.grassTop));
	for (let i = 0; i < 5; ++i) {
		tiles.push(new Tile(172,528 - 64*i,tileTypes.grassTop));
		tiles.push(new Tile(428,528 - 64*i,tileTypes.grassTop));
	}
}

//disallow right-click context menu as right click functionality is often necessary for gameplay
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();