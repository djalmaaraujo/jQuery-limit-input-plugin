/*
 * jquery.limitinput. The jQuery limit input plugin
 *
 * Copyright (c) 2009 Djalma Araújo de Andrade
 * http://www.djalmaaraujo.com.br
 * contato [at] djalmaaraujo.com.br
 *
 * Licensed under MIT License
 *
 * Launch  : Nov, 2009
 * Version : 0.2.1 edge
 * Released: 09.11.09, 09:33
 *
 * History:
 *
 * Version 0.2.1 edge
 * - Fixed bug. The keyCode SPACE was not count.
 * - Fixed Bug. When the limit was over, keyCode was disable. Add allowed key codes
 * Version 0.2.1
 * - Add checkVal() function to block typing with no escape caracter.
 * - thnks to Ruan Carlos - www.ruancarlos.com.br for the tip
 * - thnks to Wilker Lúcio for support
 * Version 0.2 
 *	- Add keydown, keypress, focus, mouseover, mouseout events
 *	- Remove keypress delay
 *
 * ###########################################################################################
 * ######################################### HOW TO ##########################################
 * ###########################################################################################
 *
 * Options:
 *	- (int)     		limit           *** Limit of caracters.
 *  - (string)  		charName		*** The word "Caracters" in your language.
 *	- (boolean) 		blockTyping     *** Block the typing when limit is over.
 *	- (string) 			sufixDisplay    *** Name will apear on the sufix of the div element.
 *	- (string) 			excededString   *** Name will apear on the sufix of the display message.
 *	- (string) 			leftString   	*** Name will apear on the sufix of the display message.
 *
 */
 
(function($) {
	
	$.fn.limitInput = function(options) {
		
		//Default parameters
		var sets = {
			limit: 140,
			sufixDisplay: 'limitInput',
			charName: "caracters",
			excededString: "exceded",
			leftString: "left",
			blockTyping: false,
		};
		
		$.extend(sets, options || {});
		
		//keyDownPress
		function keyDownPressAllowed(e) {
			
			if ((e.keyCode >= 8) && (e.keyCode <= 46)) {
				return true;
			} else {
				return false;
			}
		};
		
		//Check val
		function checkVal(element, options, e) {
		
			$.extend(sets, options || {});
				
			var inputValue = element.val();
			var inputLength = inputValue.length;
		    if (inputLength >= sets.limit) {
		    	if (!keyDownPressAllowed(e)) {
		    		if (sets.blockTyping) {
		    			return false;
		    		} else {
		    			return true;
		    		}
		    	} else {
		    		return true;
		    	}
		    } else {
		    	return true;
		    }
		};
		
		//DoLimit
		$.fn.limitInput.bindElements = function (element, options)
		{
		
			$.extend(sets, options || {});
				
			var inputValue = element.val();
			var inputLength = inputValue.length;
		    var elementDisplay = element.attr('name') + sets.sufixDisplay;
			
			if ($('div[id="' + elementDisplay + '"]').length == 0) {
				
				//Add relative position
				element.parent().addClass('jquery-limitinput-element');
				
				//Create display
			 	element.after('<div id="' + elementDisplay + '" class="jquery-limitinput-container"></div>');
			 	
			};
			
			//Message display
			if (inputLength > sets.limit) {
			    if (sets.blockTyping) element.val(inputValue.substr(0,sets.limit));
			    var inputValue = element.val();
				var inputLength = inputValue.length;
				if ((sets.limit - inputLength) < 0) {
					var displayMsg = (inputLength-sets.limit) + ' ' + sets.charName + ' ' + sets.excededString;
				} else {
					var displayMsg = sets.limit - inputLength + ' ' + sets.charName + ' ' + sets.leftString;
				}
			} else {
				var displayMsg = sets.limit - inputLength + ' ' + sets.charName + ' ' + sets.leftString;
			}
			$('#' + elementDisplay).text(displayMsg);
			
			//Element positions
			var elementWidth = element.width();
			var elementHeight = element.height();
			var elementOffsetTop = element.offset().top;
			var elementOffsetLeft = element.offset().left;
			
			//Element display positions
			var displayWidth = $('#' + elementDisplay).width();
			var displayHeight = $('#' + elementDisplay).height();
			var elementDisplayPosTop = elementOffsetTop - (displayHeight-10);
			var elementDisplayLeft = elementWidth + (displayWidth-30);
			
			//Apply display positions
			$('#' + elementDisplay).css({
			    top: elementDisplayPosTop + 'px',
			    left: elementDisplayLeft + 'px'
			});
			//Shows display
			$('#' + elementDisplay).slideDown('fast', function(){
			    $(this).fadeTo('fast',0.4);
			});
		};
		
		//Run
		return this.each(function(){
		
			//Check if its a textarea or a input valid
			var arrAllowed = [ "text", "password" ];
			if ($(this).is('textarea')) {
				initCheck = true;
			} else if ($(this).is('input')) {
			
				if ($(this).is('input') && ($.inArray($(this).attr('type'), arrAllowed) != -1)) {
					initCheck = true;
				} else {
					initCheck = false;
				};
			};
			
			//If the element is valid, apply the plugin
			if (initCheck) {
			
				//INIT
				$.fn.limitInput.bindElements($(this), options);
				//BIND
				$(this)
				
				.bind('keyup', function() { $.fn.limitInput.bindElements($(this), options); })
				.bind('keydown', function(e) { if (!checkVal($(this), options, e)) { return false; }; })
				.bind('keypress', function(e) { if (!checkVal($(this), options, e)) { return false; }; })
				.bind('focus', function() { $.fn.limitInput.bindElements($(this), options); })
				.bind('mouseover', function() { $.fn.limitInput.bindElements($(this), options); })
				.bind('mouseout', function() { $.fn.limitInput.bindElements($(this), options); })
				.bind('paste', function() {
					setTimeout(function () { $.fn.limitInput.bindElements($(this), options); }, 10); 
				});
			};
		});
	};
})(jQuery);