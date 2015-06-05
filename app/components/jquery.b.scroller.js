// --------------------------------------------------------------------
// Boggs Scroller v1.1
// Valentin Flachsel @ BoggsSystems.com
// --------------------------------------------------------------------

; (function ($) {
	var oScroll = {
		init: function (elem, options) {
			var self = this;

			self.elem = $(elem);
			self.vals = {
				contO: 0,
				thmbO: 0,
				mouse: 0
			};

			self.options = $.extend({}, $.fn.jScroll.defaults, options);

			self.build();
			self.attachEvents();
		},
		build: function () {
			var self = this, v = self.vals;
			
			v.isV = (self.options.mode == 'v');
			v.outerSize = v.isV ? 'outerHeight' : 'outerWidth';
			v.marginPos = v.isV ? 'right' : 'bottom';
			v.elemSize = v.isV ? 'height' : 'width';
			v.elemOfst = v.isV ? 'top' : 'left';
			v.mouseDir = v.isV ? 'Y' : 'X';
			
			v.hasScroll = false;
			v.scrolling = null;

			self.elem.wrapInner('<div class="ctrl_scroll_view ctrl_scroll_' + self.options.mode + '"><div class="ctrl_scroll_cont"></div></div>').append('<div class="ctrl_scroll_trck ctrl_scroll_trck_' + self.options.mode + '"><div class="ctrl_scroll_thmb ctrl_scroll_thmb_' + self.options.mode + ' ctrl_trans"></div></div>');

			self.view = self.elem.children('.ctrl_scroll_view');
			self.cont = self.view.children('.ctrl_scroll_cont');
			self.trck = self.elem.children('.ctrl_scroll_trck');
			
			if (v.isV) {
				self.trck.css({ top: parseInt(self.elem.css('paddingTop'), 10) + 'px' });
			}

			self.thmb = self.trck.children('.ctrl_scroll_thmb');

			self.trck.css( v.marginPos, -1 * (self.options.pad + self.trck[ v.isV ? 'outerWidth' : 'outerHeight' ]()) + 'px');

			v.thmbP = self.thmb[ v.outerSize ](true);

			self.update();
		},
		update: function () {
			var self = this, v = self.vals;
			
			v.viewS = self.view[ v.outerSize ](true);
			v.contS = self.cont[ v.outerSize ](true);
			
			if (v.contS > v.viewS) {
				v.contO = Math.min(v.contS - v.viewS, Math.max(0, v.contO));
				v.thmbS = Math.min(v.viewS - v.thmbP, Math.max(self.options.min, ((v.viewS / v.contS) * v.viewS)));

				self.trck.css({ display: 'none' }).css( v.elemSize, v.viewS + 'px' );

				self.thmb.css( v.elemSize, v.thmbS + 'px' );
				self.cont.css( v.elemOfst, -v.contO + 'px' );

				v.ratio = (v.contS - v.viewS) / (v.viewS - self.thmb[ v.outerSize ](true));
				v.thmbO = v.contO / v.ratio;

				self.thmb.css( v.elemOfst, v.thmbO + 'px' );
				
				v.hasScroll = true;
			} else {
				v.thmbO = v.contO = 0;
				self.trck.css({ display: 'none' });
				self.thmb.css( v.elemOfst, v.thmbO + 'px' );
				self.cont.css( v.elemOfst, v.contO + 'px' ).css({ padding: 0 + 'px' });
				
				v.hasScroll = false;
			}
		},
		attachEvents: function () {
			var self = this;

			//self.thmb.on('mousedown.jScroll', $.proxy(self.events.start, self));
			//self.trck.on('click.jScroll', $.proxy(self.events.jump, self));

			self.elem.on('DOMMouseScroll.jScroll mousewheel.jScroll', $.proxy(self.events.wheel, self));
			self.view.on('touchstart.jScroll', $.proxy(self.events.start, self));

			if (self.options.autoresize) {
				$(window).on('resize.jScroll', $.proxy(self.update, self));
			}
		},
		scrollTo: function (value) {
			var self = this, v = self.vals, contOff = Math.min(v.contS - v.viewS, Math.max(0, value));

			self.scrollToggle(true);

			if (contOff != v.contO) {
				v.contO = contOff;
				v.thmbO = Math.min(v.viewS - v.thmbP - v.thmbS, Math.max(0, v.contO / v.ratio));

				self.cont.css( v.elemOfst, -1 * v.contO + 'px' );
				self.thmb.css( v.elemOfst, v.thmbO + 'px' );
			}
		},
		scrollToggle: function(show){
			var self = this, v = self.vals;

			if(v.hasScroll) {
				if (show) {
					if(v.scrolling !== null) {
						clearTimeout(v.scrolling);
					} else {
						self.trck.fadeIn(200);
					}

					v.scrolling = setTimeout(function(){
						self.scrollToggle(false);
					}, 2000);
				} else {
					v.scrolling = null;
					self.trck.fadeOut(200);
					
				}
			}
		},
		events: {
			start: function (e) {
				var self = this, v = self.vals, isMouse = (e.type == 'mousedown');

				v.start = isMouse ? e['page' + v.mouseDir] : e.originalEvent.touches[0]['screen' + v.mouseDir];

				self.thmb.toggleClass('ctrl_scroll_thmb_d');

				$(document).on( (isMouse ? 'mousemove' : 'touchmove') + '.jScroll', $.proxy(self.events.move, self));
				$(document).one('mouseup.jScroll touchend.jScroll', $.proxy(self.events.end, self));

				//e.preventDefault();
			},
			move: function (e) {
				var self = this, v = self.vals, isMouse = (e.type == 'mousemove'), curPos = isMouse ? e['page' + v.mouseDir] : e.originalEvent.touches[0]['screen' + v.mouseDir], d = curPos - v.start, newPos;

				if (v.contS > v.viewS) {
					v.start = curPos;

					if (isMouse) {
						newPos = (v.thmbO + d) * v.ratio;
					} else {
						newPos = (v.thmbO - d) * v.ratio;
					}
					
					self.scrollTo(newPos);
				}
				
				e.preventDefault();
			},
			wheel: function (e) {
				var self = this, v = self.vals, d = ((e.originalEvent.wheelDelta) ? e.originalEvent.wheelDelta / 120 : -e.originalEvent.detail / 3) * 40;

				e.preventDefault();
				e.stopPropagation();

				if (v.contS > v.viewS) {
					self.scrollTo(v.contO - d);
				}
			},
			//jump: function (e) {
			//	var self = this, v = self.vals;

			//	if (e.target == e.delegateTarget) {
			//		var offset = $(e.target).offset()[ v.elemOfst ], min = offset + v.thmbO, max = min + v.thmbS, newPos;

			//		if (e['page' + v.mouseDir] > max) {
			//			newPos = (v.thmbO + v.thmbS) * v.ratio;
			//		} else {
			//			newPos = (v.thmbO - v.thmbS) * v.ratio;
			//		}
					
			//		self.scrollTo(newPos);
			//	}
			//},
			end: function (e) {
				var self = this;
				self.thmb.toggleClass('ctrl_scroll_thmb_d');

				$(document).off('.jScroll');
				
				//e.preventDefault();
			}
		}
	};

	// Expose the plugin
	$.fn.jScroll = function (argA, argB) {
		return this.each(function () {
			var scroll = $.data(this, 'jScroll');

			if (!scroll) {
				scroll = Object.create(oScroll);
				scroll.init(this, argA);

				$.data(this, 'jScroll', scroll);
			} else {
				if (scroll[argA]) {
					scroll[argA](argB);
				}
			}
		});
	};

	// Default options
	$.fn.jScroll.defaults = {
		pad: 10,		// Track bar left padding
		min: 20,		// Minimum thumb height
		mode: 'v',		// Scroll mode: v - vertical, h - horizontal
		autoresize: true	// Update on window resize
	};
})(jQuery);