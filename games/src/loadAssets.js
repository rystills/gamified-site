/**
 * loads all the needed files, then calls startGame to begin the game
 */
function loadAssets() {		
	//global list of script contents
	scripts = {};
	//global list of images
	images = {};
	//global list of sounds
	sounds = {};
	
	//quick and dirty way to store local text files as JS objects
	object = null;

	initLoadingScreen();
	loadedAssets = 0;
	for (assetNum = 0; assetNum < requiredFiles.length; loadSingleAsset(), ++assetNum);
}

function initLoadingScreen() {
	//clear the screen to black
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,cnv.width,cnv.height);

	//draw the loading title
	ctx.font = "64px Arial";
	ctx.fillStyle = 'white';
	ctx.textAlign="center";
	ctx.fillText("Loading " + document.title + "...",cnv.width/2,cnv.height/2);
	ctx.textAlign="start";
}

/**
 * parse a resource path for the file name, removing the directory structure and extension
 * @param path: the entire path to strip
 * @returns the resource name without the preceeding path or proceeding extension
 */
function parsePath(path) {
	let stripped = path.split("\\");
	return stripped[stripped.length-1].split('.')[0];
}

/**
 * clone all sound files so they can be used multiple times
 */
function cloneSounds() {
	Object.keys(sounds).forEach(function (key) {
		sounds[key] = sounds[key].cloneNode();
	});
}

/**
 * update the progress bar to reflect how many assets still need to be loaded
 */
function updateProgressBar() {
	//draw loading bar
	ctx.fillStyle = "gray";
	ctx.fillRect(cnv.width/2-100,cnv.height/2+120,200,25);
	ctx.fillStyle = "white";
	ctx.fillRect(cnv.width/2-100,cnv.height/2+120,200*(loadedAssets/requiredFiles.length),25);
}

/**
 * increment asset count, signifying that another asset has been loaded
 */
function incrementAssetCount() {
	if (++loadedAssets == requiredFiles.length) {
		//once we've loaded all the objects, we are ready to start the game
		cloneSounds();
		startGame();
	}
	else {
		updateProgressBar();
	}
}

/**
 * load a single asset, setting onload to move on to the next asset
 */
function loadSingleAsset() {
	//if the global object var contains a string, append it to the global scripts list
	if (object != null) {
		scripts[parsePath(requiredFiles[assetNum-1])] = object;
		object = null;
	}

	//get the element type from its file extension
	let splitName = requiredFiles[assetNum].split(".");
	let extension = splitName[splitName.length-1];
	let elemType = (extension == "js" ? "script" : (extension == "png" ? "IMG" : "audio"))
	
	//create the new element
	let elem = document.createElement(elemType);
	//sounds have to be loaded a bit differently from images and scripts
	if (elemType == "audio") {
		elem.oncanplay = incrementAssetCount;
		elem.src = splitName[0] + (!(elem.canPlayType && elem.canPlayType('audio/ogg')) ? ".m4a" : ".ogg");
	}
	else {
		elem.onload = incrementAssetCount;
		elem.src = requiredFiles[assetNum];
	}
	
	//add the new element to the body if its a script
	if (elemType == "script") {
		document.body.appendChild(elem);
	}
	//add the new element to the image dict if its an image
	else if (elemType == "IMG") {
		images[parsePath(requiredFiles[assetNum])] = elem;
	}
	else {
		sounds[parsePath(requiredFiles[assetNum])] = elem;
	}
}