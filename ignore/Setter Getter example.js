// Original version

class AClock{
	constructor(details){
		// original simple variable initialization for placeholder div ID
		this.clockPlaceholder = details.clockPlaceholder;
	}
}

// Using Getter and Setter
// getters and setters use _name because no one else touches

// When creating chooseClock, the setter will take in the dictionary with the key/value pair: clockPlaceholder: shiftingClocksPlaceholder as cph, check to see if it's a string. If it is, then this.clockPlaceholder becomes equal to shiftingClocksPlaceholder

class AClock{
	constructor(details){
		// runs the setter
		this.clockPlaceholder = details.clockPlaceholder;
		}
	//Getter and Setter to create the clock placeholder div ID
	get clockPlaceholder(){
		return this._clockPlaceholder;
	}
	set clockPlaceholder(cph){
		if(is.not.string(cph)) throw new TypeError('clockPlaceholder must be a string');
		this._clockPlaceholder = cph;
	}
}

chooseClock = new AClock({ // new means run the constructor
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescription: 'Then the time chosen will be:', 
     })


