var $body = $('body'), 
	$window = $('window'), 
	$eyes = $( '.eye' ), 
	eye_active = -1;

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

$( window ).on('resize', function() { 
	var w = $window.width(); 
	if (w > 960 && body.hasClass('sidebar-active')) { 
		$body.removeClass('sidebar-active'); 
	} 
});
$( '.button-menu' ).on('click', function() {
	$body.toggleClass('sidebar-active');
});

$( '.header-ask-a' ).on('click', function() {
	$body.addClass('modal-active');
});
$( '.modal-overlay' ).on('mousedown', function() {
	return false;
});
$( '.modal-overlay, .modal-close' ).on('click', function() {
	$body.removeClass('modal-active');
});

$eyes.each(function(i) { $( this ).attr('data-index', i); });
$eyes.on('click', function() {
	var id = $( this ).attr('data-index');

	if (eye_active !== -1) {
		$eyes.eq( eye_active ).removeClass('active');
	}

	if (id === eye_active) {
		eye_active = -1;
	} else {
		eye_active = id;
		$eyes.eq( id ).addClass('active');
	}
});

jQuery.support.cssTransitions = (function() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';

    if (typeof s[p] == 'string') { return true; }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i=0; i<v.length; i++) {
        if (typeof s[v[i] + p] == 'string') { return true; }
    }

    return false;
})();


$.fn.createSlider = function (opt) {
    var options = $.extend(true, {
    	touch_control: true,
    	repeat_slides: true,
    	change_thresold: 10,
    	control_overlay_selector: 'slider-control-overlay'
    }, opt);

    // change_thresold - minimal distance in percentage of the slider width that user should move slide at to change it

	if (typeof options.change_thresold !== 'number' && options.change_thresold < 0 || options.change_thresold > 100) {
		console.log('Invalid \'change_thresold\' value: it is \'' + options.change_thresold + '\', but expected to be a number greater than 0 and lesser than 100. Slider can be created with default thresold value - 10% !');
		options.change_thresold = 10;
	}

    return this.each(function () {
    	var base = $( this ), 
    		list = base.find( options.list_selector ), 
    		control_overlay = base.find( options.control_overlay_selector ),
    		arrows = base.find( options.arrows_selector ), 
    		slides = base.find( options.slides_selector ),
    		map_items = base.find( options.map_items_selector ),
    		width = base.width(), 
    		thresold = options.change_thresold,
    		slides_arr, current,
    		drag_start_position, relative_position, touch_x, flick, 
    		get, changeTo, animate;

    	if (!list.length) {
    		console.log('Slider can\'t be created: list element wasn\'t found in the specified slider container: ', base);
    		return;
    	}
    	if (!arrows.length) {
    		console.log('Slider can\'t be created: arrow elements weren\'t found in the specified list container: ', list);
    		return; 
    	}
		if (!slides.length) {
    		console.log('Slider can\'t be created: slide elements weren\'t found in the specified slider container: ', base);
    		return; 
    	}

    	if (!control_overlay.length) {
    		control_overlay = $('<div class="' + options.control_overlay_selector + '"></div>');
    		base.prepend( control_overlay );
    	}

    	current = 0;
    	slides_arr = slides.toArray();

	    if ( map_items.length ) {
	    	if ( map_items.length !== slides_arr.length ) {
	    		console('Warning: the amount of map items is not equal to amount of slides in the specified slider container: ', base);
	    	}
	    	map_items.each(function(i, el) {
	    		$( el ).on('click', function() {
	    			changeTo(i);
	    		});
	    	});
	    }

	    $( window ).on('resize', function() {
	    	width = base.width();
	    });

	    arrows.each(function() {
			var direction;

			$.each($( this ).attr('class').split(' '), function(i, class_name) {
				if (class_name.indexOf('-back') !== -1) {
					direction = -1;
				} else if (class_name.indexOf('-forward') !== -1) {
					direction = 1;
				}
				return false;
			});

			if (direction) {
				$( this ).on('click', (function(dir) {
					return function() {
						changeTo(current + dir);
					};
				})(direction));
			} else {
				console.log('Warning: some of arrows had neither \"' + options.arrows_selector + '-back' + '\" class nor \"' + options.arrows_selector + '-forward' + '\" class, no event listener can be attached to it!');
			}
	    });

    	get = options.repeat_slides ? 
	    	function(i) {
	    		if ( i<0 ) {
	    			return get( i += slides_arr.length );
	    		} else if (i >= slides_arr.length ) {
	    			return get( i -= slides_arr.length );
	    		}
	    		return i;
	    	} : 
	    	function(i) {
	    		if ( i === slides_arr.length || i === -1 ) {
	    			return current;
	    		}
	    		return i;
	    	};

		changeTo = options.repeat_slides ? 
			function(target) {
				current = get( target );
				animate();
				map_items.removeClass('active').eq(current).addClass('active');
			} : 
			function(target) {
				if (target === 0) {
					arrows.eq(0).addClass('inactive');
				} else if (target === slides_arr.length - 1) {
					arrows.eq(1).addClass('inactive');
				}
				if (current === 0 && target > current) {
					arrows.eq(0).removeClass('inactive');
				} else if (current === slides_arr.length -1 && target < current) {
					arrows.eq(1).removeClass('inactive');
				}
				
				current = get( target );
				map_items.removeClass('active').eq(current).addClass('active');
				animate();
			};

		animate = jQuery.support.cssTransitions ? 
			function() {
				list.css('right', current*100 + '%');
			} :
			function() {
				list.stop(true, false).animate({ 'right': current*100 + '%' }, 300);
			};

	    /*$( 'body' ).on('keydown',function(e) {
	      if (e.keyCode == 39 || e.keyCode == 37) {
	        changeTo(current+(e.keyCode-38));
	      }
	    })*/

	    control_overlay.on({
	    	'mousedown': jQuery.support.cssTransitions ?
			function(e) {
	    		base.addClass('dragged');
		    	drag_start_position = e.offsetX;
		    	return false;
		    } :
		    function(e) {
	    		base.addClass('dragged');
		    	drag_start_position = e.offsetX;
		    	list.stop(true, false);
		    	return false;
		    },
		    'mousemove': function(e) {
		    	if (drag_start_position) {
		    		// if first or last - restrict moving past them
		    		if ((current === 0 && drag_start_position - e.offsetX < 0) ||
		    			(current === slides_arr.length - 1 && drag_start_position - e.offsetX > 0)) {
		    			return;
		    		}
		    		relative_position = (drag_start_position - e.offsetX) * (100/width);
		    		list.css('right', current*100 + relative_position + '%');
			    }
		    },
		    'mouseup': function(e) {
		    	if ( Math.abs(relative_position) > thresold ) {
		    		changeTo( current + sign(relative_position) );
		    	} else {
		    		animate();
		    	}
		    	drag_start_position = 0;
		    	relative_position = 0;
		    	base.removeClass('dragged');
		    }, 
		    'mouseleave': function(e) {
		    	if (drag_start_position) {
			    	if ( Math.abs(relative_position) > thresold ) {
			    		changeTo( current + sign(relative_position) );
			    	} else {
			    		animate();
			    	}
			    	drag_start_position = 0;
			    	relative_position = 0;
			    	base.removeClass('dragged');
			    }
		    }
	    });


	    if (options.touch_control) {

			/*if (navigator.msMaxTouchPoints) {

			  $('#slider').addClass('ms-touch');

			  $('#slider').on('scroll', function() {
			    list.css('right', ? );
			  });

			}*/

			base.on({
				'touchstart': function(e) {
					flick = true;
					drag_start_position = e.originalEvent.touches[0].pageX;

					if (jQuery.support.cssTransitions) {
						list.stop(true, false);
					}

					setTimeout(function() {
						flick = false;
					}, 250);
					
					base.addClass('dragged');
				}, 
				'touchmove': function(e) {
					touch_x = e.originalEvent.touches[0].pageX;

		    		if ((current === 0 && drag_start_position - touch_x < 0) || 
		    			(current === slides_arr.length - 1 && drag_start_position - touch_x > 0)) {
		    			return;
		    		}

		    		relative_position = (drag_start_position - touch_x) * (100/width);
			    	list.css('right', current*100 + relative_position + '%');
				},
				'touchend': function() {
					if ( Math.abs(relative_position) > thresold || flick ) {
			    		changeTo( current + sign(relative_position) );
			    	} else {
			    		animate();
			    	}
			    	drag_start_position = 0;
			    	relative_position = 0;
			    	base.removeClass('dragged');
				},
				'touchcancel': function() {
			    	if (drag_start_position) {
				    	if ( Math.abs(relative_position) > thresold || flick ) {
				    		changeTo( current + sign(relative_position) );
				    	} else {
				    		animate();
				    	}
				    	drag_start_position = 0;
				    	relative_position = 0;
				    	base.removeClass('dragged');
				    }
				}
			});
	    } // touch control END
    });
}; // fn.createSlider END

$( '.slider' ).createSlider({ 
	list_selector: '.slider-list', 
	arrows_selector: '.slider-arrow', 
	slides_selector: '.slide',
	map_items_selector: '.slider-map-item',
	repeat_slides: false
});



// demo 
$( 'a' ).on('click', function(e) {
	e.preventDefault();
	return false;
});