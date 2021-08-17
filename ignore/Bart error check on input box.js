	/**
	 * Test if a given value is a valid IANA timezone.
	 *
	 * @param {string} val
	 * @return {boolean}
	 */
	function isIANATimezone(val){
		// make sure it's a string
		if(is.not.string(val)) return false;
		
		// make sure the zone exists
		if(is.null(moment.tz.zone(val))) return false;
		
		// if we got here all is well
		return true;
	}
	
	$YOU_TIMEZONE_TB.val(defaultTz).autocomplete({
	source: tzAutoCompeleSource, // the autocompelte values
	maximumItems: 10, // the maximum autocomplete suggestions
	treshold: 1, // the minimum number of characters to search
	onSelectItem: function(){ // event handler for selection of autocomplete suggestion
	$YOU_TIMEZONE_TB.trigger('input');
	}
	}).on('input', function(){
	// validate the timezone
	if(isIANATimezone(myIANATimezone())){
	// mark the field as valid
	$YOU_TIMEZONE_TB.removeClass('is-invalid').addClass('is-valid');
	
	// update the shared time, if any
	if(URL_DATA.timeShared){ updateSharedTime(); }
	}else{
	// timezone is invalid
	$YOU_TIMEZONE_TB.removeClass('is-valid').addClass('is-invalid');
	}
	
	// re-validate sharing & saving
	validateSharing();
	validateSaving();
	});