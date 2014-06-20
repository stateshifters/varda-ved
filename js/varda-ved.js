/* global enquire: false, Modernizr: false */
window.onload = function () {
	function adjustWindow() {

		// Get window size
		var winH = $(window).height();
		var winW = $(window).width();

		// Keep minimum height 550
		if (winH <= 550) {
			winH = 550;
		}

		var s = skrollr.init({});

		// Init Skrollr for 768 and up
		if (winW < 768) {
			s.destroy();
		}
		//else {
			// Resize our slides when we go mobile
			//$slide.height(winH);

			//skrollr.refresh($('.homeSlide'));
		//}

		// Check for touch
		if (Modernizr.touch) {
			s.destroy();
		}

	}

	function initAdjustWindow() {
		return {
			match: function () {
				adjustWindow();
			},
			unmatch: function () {
				adjustWindow();
			}
		};
	}

	enquire.register('screen and (min-width : 768px)', initAdjustWindow(), false);
};
