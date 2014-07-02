/* global enquire: false, Modernizr: false, History: false, ga: false*/
window.onload = function () {

	var s;

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

			animate: false,

			easing: 'sqrt',

			duration: function () {
				return 0;
			}
		});

	}

	function adjustWindow(match) {

		var winH = $(window).height();
		var winW = $(window).width();

		if (winH <= 550) {
			winH = 550;
		}


		if(match) {
			s = skrollr.init({});
			initMenu(s);
		} else {
			if(s) {
				s.destroy();
			}
		}
		initHistory(match);

		var hasSkrollr = true;

		if (winW < 1024) {
			initHistory(false);
			hasSkrollr = false;
		}
		if (Modernizr.touch) {
			initHistory(false);
			hasSkrollr = false;
		}

		if(hasSkrollr) {
			$('#wrap').hide();
			$('#wrap').css('visibility', 'visible');
			$('#loader').hide();
			$('#wrap').show({duration:300});
			$('#loader').remove();
		} else {
			$('#loader').remove();
		}
	}


	$('#sandwich').click(function() {
	  $('nav.mobile-menu-wrap-open').toggleClass('off');
	});
	$('.menu-1').click(function() {
	  $('nav.mobile-menu-wrap-open').toggleClass('off');
	});
	$('#sandwich2').click(function() {
	  $('nav.mobile-menu-wrap-open').toggleClass('off');
	});

	initHistory(false);
	enquire.register('screen and (min-width : 1024px)', {
		match: function () {
			adjustWindow(true);
		},
		unmatch: function () {
			adjustWindow(false);
		}
	});

};
