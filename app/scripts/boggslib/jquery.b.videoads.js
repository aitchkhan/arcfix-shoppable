; (function ($) {
	var oVAd = {
		init: function (elem, options) {
			var self = this;

			self.orig = $(elem);
			self.vals = {};
			self.view = {};
			self.options = $.extend({}, $.fn.videoAd.defaults, options);

			self.build();
			
		},
		build: function () {
			var self = this, v = self.vals;
			
			self.canPlay();
			
			v.done = $.Deferred();
			
			self.head = self.orig.find('#main_head');
			self.back = self.head.find('.head_back');
			self.ctrl = self.head.find('.head_ctrl');
			self.mttl = self.head.find('.head_title');

			self.view.error = self.orig.find('#main_error');
			
			if ($.isEmptyObject(self.options.adData)) {
				$.ajax({
					type: 'get',
					url: 'assets/response/ads.php',
					processData: false,
					contentType: false,
					dataType: 'json',
					success: function(data) {
						self.options.adData = data;
						v.done.resolve('ajaxOk');
					},
					error: function(data) {
						v.done.resolve('ajaxEr');
					}
				});
			} else {
				v.done.resolve('ajaxNa');
			}
			
			$.when(v.done).then(function(status){
				if (status == 'ajaxEr') {
					self.view.current = 'error';
					self.view.error.html('Error: Unable to retrieve data. If you are using any ad blocking software/plugins, please disable them and try again.');
				} else {
					if (v.canpl) {
						if (!$.isEmptyObject(self.options.adData)) {
							self.view.current = self.options.start;

							self.view.start = self.orig.find('#main_start').gridView({ template: 'grid_start', itemWidth: 60 });
							self.view.group = self.orig.find('#main_group').gridView({ template: 'grid_group', itemWidth: 60, itemHeight: 110 });
							self.view.groups = self.orig.find('#main_groups').gridView({ template: 'grid_groups', columns: false, itemWidth: 23 });
							
							self.view.item = self.orig.find('#main_item');
							self.view.item.find('.item_main').jScroll({ mode: 'h', pad: 23, autoresize: false });
							self.view.item.find('.item_imgs_thmb').jScroll();
							self.view.item.find('.item_revw_rgrp').jScroll();

							self.view.search = self.orig.find('#main_search');
							self.view.search.find('.search_results').jScroll({ pad: 23 });
							
							self.view.play = self.orig.find('#main_play').adPlayer();
							
							self.attachEvents();
						} else {
							self.view.current = 'error';
							self.view.error.html('There are no video ads to display.');
						}
					} else {
						self.view.current = 'error';
						self.view.error.html('Your browser is not compatible with this application\'s video format. In order to run this application, you need to upgrade to the latest version of either Firefox (Windows), Chrome (Windows, OSX), Safari (OSX) or IE (Windows).');
					}
				}

				self.switchView(self.view.current);
			});
		},
		update: function(obj) {
			var self = this;
			
			if (typeof obj !== 'undefined') {
				self.options.adData = obj;

				self.vals.ad = self.vals.group = self.vals.item = 0;
				self.switchView('start');
			}
		},
		switchView: function(to, event) {
			var self = this, id, target, to = to ? to : self.options.map[self.view.current].item;
			
			function _toggleView(state, same, cb){
			
				function __swap(elem, cb) {
					elem.css({ visibility: 'visible' }).animate({ opacity: (state ? 1 : 0) }, self.options.animation, function(){
						$(this).css({ visibility: (state ? 'visible' : 'hidden') });

						if (typeof cb === 'function') {
							cb();
						}
					});
				}

				if (self.view[self.view.current].hasClass('view_hasHead')) {
					if (!same) {
						__swap(self.head);
					}
				}
				
				__swap(self.view[self.view.current], cb);

			}
			
			function _fillShow(id) {
				self.fill(id);
				_toggleView(true);
			}

			if (event) {
				id = $(event.currentTarget).data('id');

				if(event.type == 'adPlayerPause') {
					if (id !== null) {
						self.view.current = to;

						_fillShow(id);
					}
				}
				
				if(event.type == 'adPlayerEnd') {
					self.view.current = to;
					
					_fillShow(self.vals.video);
				}
				
				if (event.type == 'click') {
					if ($(event.currentTarget).hasClass('button_resume')) {
						_toggleView(false, false, function(){
							self.view.current = 'play';
							self.view.play.adPlayer('play');
						});
					} else if ($(event.currentTarget).hasClass('button_locate')) {
						self.view.play.adPlayer('seek', self.view.group.data('time'), function(){
							_toggleView(false, false, function(){
								self.view.current = 'play';
								self.view.play.adPlayer('play');
							});
						});
					} else if ($(event.currentTarget).hasClass('button_start')) {
						_toggleView(false, (self.view.current == to), function(){
							self.view.current = to;
							self.view.play.css({ visibility: 'hidden', opacity: 0 });

							_fillShow(id);
						});
					} else {
						if (self.view.current == 'search') {
							self.searchPanel(false, function(){
								_toggleView(false, false, function(){
									self.view.current = to;

									_fillShow(id);
								});
							}, event);
						} else {
							if (!($(event.currentTarget).hasClass('grid_head') && typeof id === 'undefined')) {
								_toggleView(false, (self.view.current == to), function(){
									self.view.current = to;

									_fillShow(id);
								});
							}
						}
					}
				}
			} else {
				_fillShow(0);
			}
		},
		searchPanel: function(state, cb, e){
			var self = this,
			    main = self.view.search.find('.search_main'),
			    close = e ? ($(e.target).prop('id') == 'main_search' || $(e.currentTarget).hasClass('res_item')) : false;

			if (state !== null) {
				if (state) {
					self.view.search.data('par', self.view.current);
					self.view.current = 'search';

					self.view.search.css({ visibility: 'visible' });
					main.animate({ right: '0px' }, self.options.animation);
				} else {
					if (close) {
						self.view.current = self.view.search.data('par');

						main.animate({ right: '-500px' }, self.options.animation, function(){
							self.view.search.css({ visibility: 'hidden' });

							if (typeof cb === 'function') {
								cb();
							}
						});
					}
				}
			} else {
				if ($.isEmptyObject(self.options.searchData)) {
					$.ajax({
						type: 'get',
						url: 'assets/response/search.php',
						processData: false,
						contentType: false,
						dataType: 'json',
						success: function(data) {
							self.options.searchData = data;
							self.fill(null);
						},
						error: function(data) {
							var body = self.view.search.find('.search_results');

							body.find('.ctrl_scroll_cont').html('Error: Unable to retrieve search results.<br/><br/>Please try again.');
							body.jScroll('update');
						}
					});
				} else {
					self.fill(null);
				}
			}
		},
		switchImage: function(e){
			var self = this, 
			    trgt = $(e.currentTarget);
			    
			self.view.item.find('.item_imgs_main').html('<img src="' + trgt.prop('src') + '" />');
			self.view.item.find('.item_imgs_thmb').find('img').removeClass('selected');
			trgt.addClass('selected');
		},
		fill: function(id) {
			var self = this, data;
			
			function fillControls(obj, lim){
				self.ctrl.html('');

				for (var k in self.options.map[self.view.current].other) {
					var but = $('<div class="button_base button_' + k + '"><div></div>' + self.options.map[self.view.current].other[k] + '</div>');

					if (typeof obj !== 'undefined') {
						for (var objk in obj) {
							if ((k == 'prev' || k == 'next') && typeof lim != 'undefined') {
								but.toggleClass('disabled', lim[k]);
							}

							if (objk == k) {
								but.data('id', obj[k]);
							}
						}
					}

					but.appendTo(self.ctrl);
				}
			}
			
			switch(self.view.current) {
				case 'error':
					// Header
					self.back.css({ display: 'none' });
					self.mttl.html('Shop that video');
				break;

				case 'start':
					data = self.options.adData;
					
					// Header
					self.back.css({ display: self.options.map[self.view.current].back == null ? 'none': 'block' });
					self.mttl.html('Shop that video');
					
					fillControls();
					
					// Content
					var body = self.view.start.find('.grid_body'),
					    head = self.view.start.find('.grid_head'),
					    tplt = $('<div class="grid_item">!img!<div class="grid_item_ovr"><div class="grid_item_ttl">!ttl!</div><div class="grid_item_dsc">!dsc!</div></div></div>');

					head.find('.head_ttl').html(data[0].Name);
					head.find('.head_img').html('<img src="' + data[0].Thumbnail + '" />');
					head.find('.head_dsc').html(data[0].Description);
					head.data('id', 0);

					body.html('');

					for (var i = 1; i < data.length; i++ ) {
						var item = tplt.clone();

						item.replaceText( /!img!/gi, '<img src="' + data[i].Thumbnail + '" />');
						item.find('.grid_item_ttl').replaceText( /!ttl!/gi, data[i].Name);
						item.find('.grid_item_dsc').replaceText( /!dsc!/gi, data[i].Description);
						item.data('id', i);

						item.appendTo(body);
					};

					self.view.start.gridView('update', true);
				break;
				
				case 'play':
					self.vals.video = id;

					data = self.options.adData[self.vals.video];

					// Header
					self.back.css({ display: self.options.map[self.view.current].back == null ? 'none': 'block' });
					self.mttl.html(data.Name ? data.Name : 'Shop that video' );

					// Content
					self.view.play.adPlayer('load', {
						video: data.Media,
						poster: data.Thumbnail,
						groups: data.ProductGroupTimeLine.map(function(elem){ return elem.Time || null })
					});
				break;

				case 'group':
					self.vals.group = id;

					data = self.options.adData[self.vals.video].ProductGroupTimeLine[self.vals.group];

					// Header
					self.back.css({ display: self.options.map[self.view.current].back == null ? 'none': 'block' });
					self.mttl.html(data.Title || 'Untitled group');

					fillControls({ 'prev': Math.max(0, self.vals.group - 1), 'next': Math.min(self.options.adData[self.vals.video].ProductGroupTimeLine.length - 1, self.vals.group + 1) }, { 'prev': (self.vals.group - 1 < 0), 'next': (self.vals.group + 1 > self.options.adData[self.vals.video].ProductGroupTimeLine.length - 1) });
					
					// Content
					var body = self.view.group.find('.grid_body'),
					    head = self.view.group.find('.grid_head'),
					    tplt = $('<div class="grid_item">!img!<div class="grid_item_ttl">!ttl!</div><div class="grid_item_dsc">!dsc!</div></div>');
					    
					self.view.group.data('time', self.options.adData[self.vals.video].ProductGroupTimeLine[self.vals.group].Time);

					head.find('.head_ttl').html(data.Subtitle || 'Untitled');
					head.find('.head_img').html('<img src="' + (data.Thumbnail || 'Assets/blank_rectangle.png') + '" />');
					head.find('.head_lnk').html(data.MakeThisYourLookURL ? '<a class="button_buy" href="' + data.MakeThisYourLookURL + '" target="_blank">Make this your look!</a>' : '');
					head.find('.head_dsc').html(data.Description || 'No description found');

					body.html('');

					for (var i = 0; i < data.Products.length; i++ ) {
						var item = tplt.clone();

						item.replaceText( /!img!/gi, '<img src="' + (data.Products[i].ProductImages[0] || 'Assets/blank_square.png') + '" />');
						item.find('.grid_item_ttl').replaceText( /!ttl!/gi, data.Products[i].Name || 'Untitled');
						item.find('.grid_item_dsc').replaceText( /!dsc!/gi, data.Products[i].Description || 'No description found');
						item.data('id', i);

						item.appendTo(body);
					};

					self.view.group.gridView('update', true);
				break;
				
				case 'groups':
					data = self.options.adData[self.vals.video];

					// Header
					self.back.css({ display: self.options.map[self.view.current].back == null ? 'none': 'block' });
					self.mttl.html(data.Name || 'Untitled ad');

					fillControls();

					// Content
					var body = self.view.groups.find('.grid_body'),
					    tplt = $('<div class="grid_item"><div class="grid_item_ttl">!ttl!</div>!img!<div class="grid_item_lnk">!lnk!</div><div class="grid_item_stl">!stl!</div><div class="grid_item_dsc">!dsc!</div></div>');

					body.html('');
					
					for (var i = 0; i < data.ProductGroupTimeLine.length; i++ ) {
						var item = tplt.clone();

						item.find('.grid_item_ttl').replaceText( /!ttl!/gi, data.ProductGroupTimeLine[i].Title || 'Untitled group');
						item.replaceText( /!img!/gi, '<img src="' + (data.ProductGroupTimeLine[i].Thumbnail || 'Assets/blank_rectangle.png') + '" />');
						item.find('.grid_item_lnk').replaceText( /!lnk!/gi, (data.ProductGroupTimeLine[i].MakeThisYourLookURL ? '<a class="button_buy" href="' + data.ProductGroupTimeLine[i].MakeThisYourLookURL + '" target="_blank">Make this your look!</a>' : ''));
						item.find('.grid_item_stl').replaceText( /!stl!/gi, data.ProductGroupTimeLine[i].Subtitle || 'Untitled');
						item.find('.grid_item_dsc').replaceText( /!dsc!/gi, data.ProductGroupTimeLine[i].Description || 'No description found');
						item.data('id', i);

						item.appendTo(body);
					};

					self.view.groups.gridView('update', true);
					
				break;
				
				case 'item':
					self.vals.item = id;

					data = self.options.adData[self.vals.video].ProductGroupTimeLine[self.vals.group].Products[self.vals.item];

					// Header
					self.back.css({ display: self.options.map[self.view.current].back == null ? 'none': 'block' });
					self.mttl.html(data.Name || 'Untitled product');

					fillControls({ 'up' : self.vals.group });
					
					// Content
					var colors = self.view.item.find('.item_colr_cont').html(''),
					    sizes = self.view.item.find('.item_size_cont').html(''),
					    reviews_m = self.view.item.find('.item_revw_rgrp'),
					    reviews_c = reviews_m.find('.ctrl_scroll_cont').html(''),
					    img_main = self.view.item.find('.item_imgs_main').html(''),
					    img_thmb_m = self.view.item.find('.item_imgs_thmb'),
					    img_thmb_t = img_thmb_m.find('.ctrl_scroll_cont').html(''),
					    contW = self.view.item.find('.item_info').outerWidth(true);
					    
					self.view.item.find('.item_sttl').html(data.Subtitle || 'Untitled');
					self.view.item.find('.item_price').html(data.Price.PriceValue || '$0.00');
					self.view.item.find('.item_desc').html(data.Description || 'No description found');
					
					self.view.item.find('.item_link').html( data.MakeThisYourLookURL ? '<a class="button_buy" href="' + data.MakeThisYourLookURL + '" target="_blank">Make this your look!</a>' : '' );

					// Colors
					if (data.ProductColors.length) {
						$.each(data.ProductColors, function(){
							$('<div class="item_colr_item" style="background: ' + this.ColorValue + ';"></div>').appendTo(colors);
						});
					} else {
						self.view.item.find('.item_colr').hide();
					}

					// Sizes
					if (data.Sizes.length) {
						$.each(data.Sizes, function(){
							$('<div class="item_size_item">' + this + '</div>').appendTo(sizes);
						});
					} else {
						self.view.item.find('.item_size').hide();
					}

					// Reviews
					if(self.options.showReviews) {
						if (Object.keys(data.Reviews).length) {
							$.each(data.Reviews, function(){
								var cont = $('<div class="item_revw_item"><div class="item_revw_item_name">' + this.ReviewName + '</div><div class="item_revw_item_rtng"></div><div class="item_revw_item_desc">' + this.ReviewText + '</div></div>'),
								    rtng = cont.find('.item_revw_item_rtng');
								
								for (i = 0; i < this.ReviewRating; i++) {
									$('<div class="item_revw_item_rtng_pos"></div>').appendTo(rtng);
								}
								
								for (i = 0; i < 5 - this.ReviewRating; i++) {
									$('<div class="item_revw_item_rtng_neg"></div>').appendTo(rtng);
								}
								
								cont.appendTo(reviews_c);
							});
							
							contW += self.view.item.find('.item_revw').outerWidth(true);
							
							reviews_m.jScroll('update');
							
							
						} else {
							self.view.item.find('.item_revw').hide();
						}
					} else {
						self.view.item.find('.item_revw').hide();
					}

					// Images
					if (data.ProductImages.length) {
						$('<img src="' + data.ProductImages[0] + '" />').appendTo(img_main);
						
						$.each(data.ProductImages, function(i){
							$('<img src="' + this + '" class="item_thmb' + (i == 0 ? ' selected' : '') + '" />').appendTo(img_thmb_t);
						});
						
						contW += self.view.item.find('.item_imgs').outerWidth(true);

						img_thmb_m.jScroll('update');
					} else {
						self.view.item.find('.item_imgs').hide();
					}

					self.view.item.find('.item_body').css({ width: contW + 'px' });
					self.view.item.find('.item_main').jScroll('update');

				break;
				
				case 'search':
					data = self.options.searchData;

					var body = self.view.search.find('.search_results'),
					    cont = body.find('.ctrl_scroll_cont').html(''),
					    tplt = $('<div class="res_item">!img!<div class="res_item_ttl">!ttl!</div><div class="res_item_dsc">!dsc!</div></div>');

					if (data.length) {
						for (var i = 0; i < data.length; i++ ) {
							var item = tplt.clone();

							item.replaceText( /!img!/gi, '<img src="' + data[i].Thumbnail + '" />');
							item.find('.res_item_ttl').replaceText( /!ttl!/gi, data[i].Name);
							item.find('.res_item_dsc').replaceText( /!dsc!/gi, data[i].Description);
							item.data('id', i);

							item.appendTo(cont);
						};
						
						body.jScroll('update');
					} else {
						cont.html('<span>No results found.<span>');
					}

				break;

				default:
				break;
			}
		},
		attachEvents: function () {
			var self = this;

			// Search
			self.orig.on('click.videoAd touch.videoAd', '.button_search', $.proxy(self.searchPanel, self, true, null));
			self.orig.on('click.videoAd touch.videoAd', '#main_search', $.proxy(self.searchPanel, self, false, null));
			self.orig.on('click.videoAd touch.videoAd', '.button_go', $.proxy(self.searchPanel, self, null, null));
			self.orig.on('click.videoAd touch.videoAd', '.res_item', $.proxy(self.switchView, self, 'play'));

			// Navigation
			self.orig.on('click.videoAd touch.videoAd', '.button_up, .button_prev:not(".disabled"), .button_next:not(".disabled")', $.proxy(self.switchView, self, 'group'));

			// Views
			self.orig.on('click.videoAd touch.videoAd', '.grid_item, .grid_head', $.proxy(self.switchView, self, null));
			self.orig.on('click.videoAd touch.videoAd', '.button_all', $.proxy(self.switchView, self, 'groups'));
			self.orig.on('click.videoAd touch.videoAd', '.button_start', $.proxy(self.switchView, self, 'start'));

			// Video
			self.view.play.on('adPlayerPause', $.proxy(self.switchView, self, null));
			self.view.play.on('adPlayerEnd', $.proxy(self.switchView, self, 'groups'));
			self.orig.on('click.videoAd touch.videoAd', '.button_resume', $.proxy(self.switchView, self, null));
			self.orig.on('click.videoAd touch.videoAd', '.button_locate', $.proxy(self.switchView, self, null));
			
			// Item
			self.orig.on('click.videoAd touch.videoAd', '.item_thmb', $.proxy(self.switchImage, self));
		},
		canPlay: function(){
			var self = this, v = self.vals, dummy = document.createElement('video');
			
			v.canpl = false;
			
			if(dummy.canPlayType) {
				v.canpl = (dummy.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') == 'probably');
			}
		}
	};

	$.fn.videoAd = function (argA, argB) {
		return this.each(function () {
			var vad = $.data(this, 'vAd');
			
			if (!vad) {
				vad = Object.create(oVAd);
				
				vad.init(this, argA);
				$.data(this, 'vAd', vad);
			} else {
				if (vad[argA]) {
					return vad[argA](argB);
				}
			}
		});
	};

	$.fn.videoAd.defaults = {
		adData: [],
		searchData: [],
		showReviews: true,
		start: 'start',		// Default start view
		animation: 200,		// Views transition animation in ms
		map: {			// Default navigation map
			start: { back: null, item: 'play', other: { 'search': 'Search' } },
			play: { back: 'start', item: 'group' },
			group: { back: 'play', item: 'item', other: { 'locate' : 'Seek and play', 'prev' : 'Previous', 'all' : 'All groups', 'next' : 'Next', 'start' : 'Home', 'search' : 'Search'} },
			groups: { back: 'play', item: 'group', other: { 'start' : 'Home', 'search' : 'Search' } },
			item: { back: 'play', item: null, other: { 'up': 'Back to group', 'start': 'Home', 'search': 'Search' } }
		}
	};
})(jQuery);