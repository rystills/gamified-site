/**
 * quick and dirty class for storing enumerable values
 */
function Enum() {
	this.all = [];
	//store the total number of values in the enum for easy indexing
	this.length = 0;
	//for each specified value in the Enum, allow referencing the value by name or by number
	for (let i = 0; i < arguments.length; ++i) {
		this.add(arguments[i]);
	}
}

/**
 * add an additional element to this enum
 * @param elem: the element to add to our enum
 */
Enum.prototype.add = function(elem) {
	this[elem] = this.length;
	this[this.length] = elem;
	this.all[this.length] = elem;
	++this.length;
}