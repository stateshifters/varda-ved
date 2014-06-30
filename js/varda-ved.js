/* global enquire: false, Modernizr: false, History: false, ga: false */
window.onload = function () {

	var sortOn = function (arr, key) {
		arr.sort(function (a, b) {
			if (a[key] < b[key]) {
				return -1;
			} else if (a[key] > b[key]) {
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


	var breakpoints = (function () {
		var menuItems = $('#menu').find('a');
		var points = [];
		$.each(menuItems, function (i, elem) {

			var state = elem.getAttribute('href');
			var position = parseInt(elem.getAttribute('data-menu-top'), 10);

			points.push({
				'state': state,
				'position': position
			});
		});

		return sortOn(points, 'position');

	}());

	function initHistory(parallax) {
		function onScroll() {
			var scroll = window.pageYOffset || document.documentElement.scrollTop;

			var candidate = null;

			$.each(breakpoints, function (index, breakpoint) {
				if (candidate === null) {
					candidate = breakpoint;
				}
				if (scroll >= breakpoint.position) {
					candidate = breakpoint;
				}
			});
			if (History.getState().hash !== '/' + candidate.state) {
				History.pushState(null, null, candidate.state);
				if(ga!==undefined) {
					ga('send', 'pageview', candidate.state);
					ga('send', 'screenview', {
						'screenName': candidate.state.substring(1)
					});
				}
			}
		}
		if(parallax) {
			$.each(breakpoints, function (index, breakpoint) {
				$(breakpoint.state).waypoint('destroy');
			});
			$(window).scroll(onScroll);
		} else {
			$(window).scroll();
			$.each(breakpoints, function (index, breakpoint) {
				$(breakpoint.state).waypoint(function(){
					History.pushState(null, null, breakpoint.state);
					if(ga!==undefined) {
						ga('send', 'pageview', breakpoint.state);
						ga('send', 'screenview', {
							'screenName': breakpoint.state.substring(1)
						});
					}
				});
			});
		}


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
			duration: function () {
//				By default, the duration is hardcoded at 500ms.
				return 0;

				//But you could calculate a value based on the current scroll position (`currentTop`) and the target scroll position (`targetTop`).
				//return Math.abs(currentTop - targetTop) * 10;
			}
		});

	}

	function adjustWindow(match) {

		// Get window size
		var winH = $(window).height();
		var winW = $(window).width();

		// Keep minimum height 550
		if (winH <= 550) {
			winH = 550;
		}

		var s = skrollr.init({});
		initMenu(s);
		initHistory(match);
		var hasSkrollr = true;
		// Init Skrollr for 1024 and up
		if (winW < 1024) {
			s.destroy();
			initHistory(false);
			hasSkrollr = false;
		}
		if (Modernizr.touch) {
			s.destroy();
			initHistory(false);
			hasSkrollr = false;
		}

		if(hasSkrollr) {
			$('#wrap').hide();
			$('#wrap').css('visibility', 'visible');
			$('#loader').hide();
			$('#wrap').show({duration:1000});
			$('#loader').remove();
		} else {
			$('#loader').remove();
		}
	}

	function initAdjustWindow() {
		return {
			match: function () {
				adjustWindow(true);
			},
			unmatch: function () {
				adjustWindow(false);
			}
		};
	}

	initHistory(false);
	enquire.register('screen and (min-width : 1024px)', initAdjustWindow(), false);

	$(function() {
		$('#sandwich').click(function() {
		  $('.menu_wrap').removeClass('menu_wrap').addClass('menu_wrap_sandwich');
		});
		$('.menu-1').click(function() {
		  $('.menu_wrap_sandwich').removeClass('menu_wrap_sandwich').addClass('menu_wrap');
		});
	});
};
