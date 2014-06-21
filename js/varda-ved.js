/* global enquire: false, Modernizr: false */
window.onload = function () {

	function initMenu(s) {
		skrollr.menu.init(s, {
			//skrollr will smoothly animate to the new position using `animateTo`.
			animate: false,

			//The easing function to use.
			easing: 'sqrt',

			//Multiply your data-[offset] values so they match those set in skrollr.init
//			scale: 2,

			//How long the animation should take in ms.
			duration: function() {
//				By default, the duration is hardcoded at 500ms.
				return 0;

				//But you could calculate a value based on the current scroll position (`currentTop`) and the target scroll position (`targetTop`).
				//return Math.abs(currentTop - targetTop) * 10;
			}
		});

	}

	function adjustWindow() {

		// Get window size
		var winH = $(window).height();
		var winW = $(window).width();

		// Keep minimum height 550
		if (winH <= 550) {
			winH = 550;
		}

		var s = skrollr.init({});
		initMenu(s);

		// Init Skrollr for 1024 and up
		if (winW < 1024) {
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

	enquire.register('screen and (min-width : 1024px)', initAdjustWindow(), false);
};
