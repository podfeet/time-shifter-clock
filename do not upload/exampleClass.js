class ImaginaryCurrency{
	constructor(details){
		this.name = details.name;
		this.descriptionHTML = details.descriptionHTML;
		this.symbol = details.symbol;
		this.symbolHTML = details.symbolHTML;
		this.numDecimalPlaces = numDecimalPlaces;
	}
	
	describe(){
		const plainTextDesc = $(`<p>${this.descriptionHTML}</p>`).text();
		return `The ${this.name} is ${plainTextDesc}. Its symbol is ${this.symbol}, and it has ${this.numDecimalPlaces} decimal places.`;
	}

	describeHTML(){
		return `<p>The ${this.name} is ${this.descriptionHTML}. Its symbol is ${this.symbolHTML}, and it has ${this.numDecimalPlaces} decimal places.</p>`
	}

	as(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbol}${formattedAmount}`;
	}