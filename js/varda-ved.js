/* global enquire: false, Modernizr: false, History: false, console:false */
window.onload = function () {

	var sortOn = function(arr, key){
		arr.sort(function(a, b){
			if(a[key] < b[key]){
				return -1;
			}else if(a[key] > b[key]){
				return 1;
			}
			return 0;
		});
		return arr;
	};

	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function (callback) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					},
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
		}
	}());


	var breakpoints = (function(){
		var menuItems = $('#menu').find('a');
		var points = [];
		$.each(menuItems, function(i, elem) {

			var state = elem.getAttribute('href');
			var position = parseInt(elem.getAttribute('data-menu-top'), 10);

			points.push({
				'state': state,
				'position': position
			});
		});

		return sortOn(points,'position').reverse();

	}());

	function initHistory() {

		console.log(breakpoints);
		function onScroll() {
			var scroll = window.pageYOffset || document.documentElement.scrollTop;

			$.each(breakpoints, function(index, breakpoint) {

				if (scroll>breakpoint.position) {
					console.log(scroll, breakpoint.position);
					History.pushState(null, null, breakpoint.state);
					return;
				}
			});
		}

		$(window).scroll(onScroll);

	}


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
		initHistory();

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
