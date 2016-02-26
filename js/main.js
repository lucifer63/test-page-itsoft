var $body = $('body'), $window = $('window'), $eyes = $( '.eye' ), eye_active;

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
};

$( window ).on('resize', function() { 
	var w = $window.width(); 
	if (w > 960 && body.hasClass('sidebar-active')) { 
		$body.removeClass('sidebar-active'); 
	} 
})
$( '.button-menu' ).on('click', function() {
	$body.toggleClass('sidebar-active');
})

$( '.header-ask-a' ).on('click', function() {
	$body.addClass('modal-active');
})
$( '.modal-overlay' ).on('mousedown', function() {
	return false;
});
$( '.modal-overlay, .modal-close' ).on('click', function() {
	$body.removeClass('modal-active');
})

$eyes.each(function(i) { $( this ).attr('data-id', i); });
$eyes.on('click', function() {
	var id = $( this ).attr('data-id');

	if (eye_active) {
		$eyes.eq( eye_active ).removeClass('active');
	}

	if (id == eye_active) {
		eye_active = -1;
	} else {
		eye_active = id;
		$eyes.eq( id ).addClass('active');
	}
});

$.fn.createSlider = function (opt) {
    var options = $.extend(true, {
    	touch_control: true,
    	repeat_slides: true
    }, opt);

    console.log(options);

    return this.each(function () {
    	var base = $( this ), 
    		list = base.find( options.list_selector ), 
    		arrows = base.find( options.arrows_selector ), 
    		slides = base.find( options.slides_selector ),
    		map_items = base.find( options.map_items_selector ),
    		slides_arr, current, get, changeTo, 
    		width = base.width(), drag_start_position, relative_position,
    		touch_x, flick;

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

    	slides_arr = slides.toArray();
    	current = 0;
    	get = options.repeat_slides ? function(i) {
    		if ( i<0 ) {
    			return get( i += slides_arr.length );
    		} else if (i >= slides_arr.length ) {
    			return get( i -= slides_arr.length );
    		}
    		return i;
    	} : function(i) {
    		if ( i === slides_arr.length || i === -1 ) {
    			return current;
    		}
    		return i;
    	}
		changeTo = options.repeat_slides ? function(target) {
			current = get( target );
			list.css('right', current*100 + '%');
			map_items.removeClass('active').eq(current).addClass('active');
		} : function(target) {
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
			list.css('right', current*100 + '%');
		}

	    /*$( 'body' ).on('keydown',function(e) {
	      if (e.keyCode == 39 || e.keyCode == 37) {
	        changeTo(current+(e.keyCode-38));
	      }
	    })*/
	    if ( map_items.length ) {
	    	if ( map_items.length !== slides_arr.length ) {
	    		console('Warning: the amount of map items is not equal to amount of slides in the specified slider container: ', base);
	    	}
	    	map_items.each(function(i, el) {
	    		$( el ).on('click', function() {
	    			changeTo(i);
	    		})
	    	})
	    }

	    arrows.each(function() {
			var direction;

			$.each($( this ).attr('class').split(' '), function(i, class_name) {
				if (class_name.indexOf('-back') !== -1) {
					direction = -1;
				} else if (class_name.indexOf('-forward') !== -1) {
					direction = 1;
				};
				return false;
			});

			if (direction) {
				$( this ).on('click', (function(dir) {
					return function() {
						changeTo(current + dir);
					}
				})(direction));
			} else {
				console.log('Warning: some of arrows had neither \"' + options.arrows_selector + '-back' + '\" class nor \"' + options.arrows_selector + '-forward' + '\" class, no event listener can be attached to it!');
			}
	    })

	    $( window ).on('resize', function() {
	    	width = base.width();
	    })

	    base.on({
	    	'mousedown': function(e) {
	    		base.addClass('dragged');
		    	drag_start_position = e.offsetX;
		    	return false;
		    },
		    'mousemove': function(e) {
		    	if (drag_start_position) {
		    		// if first or last - restrict moving past them
		    		if ((current === 0 && drag_start_position - e.offsetX < 0) || (current === slides_arr.length - 1 && drag_start_position - e.offsetX > 0)) {
		    			return;
		    		}
		    		relative_position = (drag_start_position - e.offsetX) * (100/width);
			    	list.css('right', current*100 + relative_position + '%');
			    }
		    },
		    'mouseup': function(e) {
		    	if ( Math.abs(relative_position) > 25 ) {
		    		changeTo( current + sign(relative_position) );
		    	} else {
		    		list.css('right', current*100 + '%');
		    	}
		    	drag_start_position = 0;
		    	relative_position = 0;
		    	base.removeClass('dragged');
		    }, 
		    'mouseleave': function(e) {
		    	if (drag_start_position) {
			    	if ( Math.abs(relative_position) > 25 ) {
			    		changeTo( current + sign(relative_position) );
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
				'touchstart': function(event) {
					flick = true;
					drag_start_position = event.originalEvent.touches[0].pageX;

					setTimeout(function() {
						flick = false;
					}, 250);
					
					base.addClass('dragged');
				},
				'touchmove': function(event) {
					touch_x = event.originalEvent.touches[0].pageX;

		    		if ((current === 0 && drag_start_position - touch_x < 0) || 
		    			(current === slides_arr.length - 1 && drag_start_position - touch_x > 0)) {
		    			return;
		    		}

		    		relative_position = (drag_start_position - touch_x) * (100/width);
			    	list.css('right', current*100 + relative_position + '%');
				},
				'touchend': function(event) {
					if ( Math.abs(relative_position) > 25 || flick ) {
			    		changeTo( current + sign(relative_position) );
			    	};
			    	drag_start_position = 0;
			    	relative_position = 0;
			    	base.removeClass('dragged');
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
})



// demo 
$( 'a' ).on('click', function(e) {
	e.preventDefault();
	return false;
})

