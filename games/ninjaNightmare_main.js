/**
 * render all objects and HUD elements
 */
function render() {
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
		"ninjaNightmare_images\\pipes.png", "ninjaNightmare_images\\player.png", "ninjaNightmare_images\\eraser.png", //images
		"targetTest_sounds\\confirm.ogg","targetTest_sounds\\select.ogg", //sounds
		"ninjaNightmare_src\\GameObject.js","ninjaNightmare_src\\Enemy.js", //source files
		"ninjaNightmare_src\\Tile.js","ninjaNightmare_src\\Particle.js","ninjaNightmare_src\\Player.js", //source files
		"ninjaNightmare_src\\Room.js","ninjaNightmare_src\\TextBox.js", "ninjaNightmare_src\\Grid.js", //source files
		"ninjaNightmare_src\\ScrollIndicator.js", "ninjaNightmare_src\\Placer.js","ninjaNightmare_src\\Eraser.js" //source files
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

	//game vars
	particles = [];
	gridSize = 64;

	//level creator room
	rmCreate = new Room("turquoise");
	player = rmCreate.addObject(new Player(gridSize*4 + 16,gridSize*4 + 8,ctx));
	rmCreate.addUI(new ScrollIndicator(5,25,uictx));
	rmCreate.addUI(new Button(5,45,uicnv,"Playtest",24,togglePlaytest));
	rmCreate.addUI(new Button(5,85,uicnv,"Place Ground Tile",24,activatePlacer,placeTypes.dirt));
	rmCreate.addUI(new Button(5,125,uicnv,"Eraser",24,activateEraser));
	placer = rmCreate.addUI(new Placer(cnv));
	eraser = rmCreate.addUI(new Eraser(cnv));
	rmCreate.addUI(new Grid(cnv));

	//main menu room
	rmMain = new Room("rgba(0,0,60)");
	rmMain.addUI(new TextBox(cnv.width/2,cnv.height/3,true,"Welcome to Ninja Nightmare!","rgb(255,255,255)",54,ctx));
	rmMain.addUI(new Button(cnv.width/2,cnv.height/2,cnv,"Create a Level",24,openLevelCreator));
	
	activeRoom = rmMain;
}

/**
 * toggle between playtest mode and create mode
 * @param btn: the button which triggered this function
 */
function togglePlaytest(btn) {
	rmCreate.setRunning();
	btn.updateText(rmCreate.running ? "Stop Playtesting" : "Playtest");
}

/**
 * get a list of the 0-9 tiles surrounding the designated object (0-8 if the object is a tile, as we don't count the input obj)
 * @param obj: the object for whom we wish to locate surrounding tiles
 * @returns a list of tiles surrounding the input object
 */
function getSurroundingTiles(obj) {
	let cx = obj.cx();
	let cy = obj.cy();
	let gridX = Math.floor(cx/gridSize);
	let gridY = Math.floor(cy/gridSize);
	let tileList = [];
	for (let i = 0; i < 3; ++i) {
		for (let r = 0; r < 3; ++r) {
			let curTile = activeRoom.tiles[(gridX + i-1)+","+(gridY + r-1)]; 
			if (curTile != null && curTile != obj) {
				tileList.push(curTile);
			}
		}
	}
	return tileList;
}

/**
 * activate the level creator placer with the specified object/tile type
 * @param placeType: the type to set the placer to
 * @param btn: the button which triggered this function
 */
function activatePlacer(placeType, btn) {
	placer.activate(placeType);
}

/**
 * activate the level creator eraser
 * @param btn: the button which triggered this function
 */
function activateEraser(btn) {
	eraser.activate();
}

/**
 * switch to the level creator room
 * @param btn: the button which triggered this function
 */
function openLevelCreator(btn) {
	activeRoom = rmCreate;
}

//disallow right-click context menu as right click functionality is often necessary for gameplay
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();