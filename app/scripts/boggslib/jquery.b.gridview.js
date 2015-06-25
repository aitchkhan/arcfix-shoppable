// --------------------------------------------------------------------
// GridView Plugin
// Valentin Flachsel @ BoggsSystems.com
// --------------------------------------------------------------------

// Load dependencies
//$.getScript("_inc/jquery.b.gridview.replacetext.js");

// Main script
; (function ($) {
	var oGView = {
		init: function (elem, options) {
			var self = this;

			self.orig = $(elem);
			self.vals = {};
			self.options = $.extend({}, $.fn.gridView.defaults, options);

			self.build();
			self.attachEvents();
		},
		build: function () {
			var self = this, v = self.vals;

			self.orig.addClass(self.options.template);

			self.cont = self.orig.find('.grid_cont').jScroll({ mode: 'h', pad: 23, autoresize: false });
			self.body = self.orig.find('.grid_body');
			self.item = self.orig.find('.grid_item');
			
			v.itemM = parseInt(self.item.css('marginBottom'));
		},
		update: function (items) {
			var self = this, v = self.vals, ih, bW;
			    
			v.contW = self.cont.width();
			v.contH = self.cont.height();
			v.itemW = Math.round((v.contW * self.options.itemWidth) / 100);
			v.itemH = (self.options.itemHeight == 0 ? Math.round(v.itemW * 0.5625) : self.options.itemHeight);

			ih = v.itemH + v.itemM;
			
			if (items) {
				self.item = self.orig.find('.grid_item');
			}

 			if (self.options.columns) {
				var ct = Math.floor(v.contH / ih) + (v.contH % ih >= v.itemH ? 1 : 0),
				    c = 0;
				    
				self.item.each(function() {
					if ($(this).parent('.grid_col').length != 0) {
						$(this).unwrap();
					}
				});
				    
				for(var i = 0; i < self.item.length; i += ct) {
					c++;
					self.item.slice(i, i+ct).wrapAll('<div class="grid_col" style="width: ' + v.itemW + 'px;"></div>');
				}

				bW = (c * (v.itemW + 50)) - 50;
			} else {
				bW = (self.item.length * (v.itemW + 50));
			}

			self.item.css({ height: v.itemH + 'px', width: v.itemW + 'px' });
			self.body.css({ width: bW + 'px' });
			self.cont.jScroll('update');
		},
		attachEvents: function () {
			var self = this;

			$(window).on('resize', $.proxy(self.update, self, false));
		}
	};

	$.fn.gridView = function (argA, argB) {
		return this.each(function () {
			var gview = $.data(this, 'gView');

			if (!gview) {
				gview = Object.create(oGView);
				gview.init(this, argA);

				$.data(this, 'gView', gview);
			} else {
				if (gview[argA]) {
					return gview[argA](argB);
				}
			}
		});
	};

	$.fn.gridView.defaults = {
		columns: true,			// Columnize items based on internal algorithm
		itemWidth: 30,
		itemHeight: 0,
		columnMargin: 50

		// TODO: Create a default template
		//template: 'grid_default'	// Grid template
	};
})(jQuery);