// --------------------------------------------------------------------

// Boggs AdPlayer v1.0

// Valentin Flachsel @ BoggsSystems.com

// --------------------------------------------------------------------



// Main script

; (function ($, window, document, undefined) {

	var oPlayer = {

		init: function (elem, options) {

			var self = this;



			self.elem = $(elem);

			self.vals = {};

			self.vidp = {};

			self.options = $.extend({}, $.fn.adPlayer.defaults, options);

			

			self.build();

		},

		build: function () {

			var self = this, v = self.vals;

			

			v.plbk = true;



			v.time = 0;

			v.wait = false;

			v.browser = {};

			v.browser.opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

			v.browser.firefox = typeof InstallTrigger !== 'undefined';

			v.browser.safari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

			v.browser.chrome = !!window.chrome && !v.browser.opera;

			v.browser.ie = /*@cc_on!@*/false || !!document.documentMode;



			v.cnvw = 640;

			v.cnvh = 360;



			self.elem.append('<div class="adplay_msg"></div><div class="adplay_ovr"><div class="adplay_vig"></div><canvas width="' + v.cnvw + '" height="' + v.cnvh + '" class="adplay_blr"></canvas>');

			self.elem.data('id', null);

			

			self.vidp.msg = self.elem.find('.adplay_msg');

			self.vidp.ovr = self.elem.find('.adplay_ovr');

			self.vidp.blr = self.elem.find('.adplay_blr');

			self.vidp.con = self.vidp.blr[0].getContext("2d");



			$.proxy(self.utils.setSize, self)();

			self.load(self.options.video);

			self.attachEvents(false);

		},

		load: function (obj) {

			var self = this, v = self.vals;



			if (obj) {

				self.options.video = obj.video;

				self.options.poster = obj.poster;

				self.options.groups = obj.groups;

			}



			if (self.options.video != null) {

				

				if (self.vidp.vid) {

					self.vidp.vid.attr('src', self.options.video);

				} else {

					self.vidp.vid = $('<video src="' + self.options.video + '" class="adplay_vid" width="' + v.w + '" height="' + v.h + '" type="video/mp4" style="left: ' + v.ol + 'px; top: ' + v.ot + 'px"></video>').appendTo(self.elem);



					self.attachEvents(true);

				}

				

				self.vidp.msg.html('Click / Tap on the screen to begin video ad playback.').fadeIn(100);



				$.proxy(self.utils.setPoster, self, self.options.poster)();



				self.vidp.vid[0].load();

				self.vidp.vid.prop('volume', 0.5);

			}

		},

		play: function(end, cb) {

			var self = this, v = self.vals, end = (typeof end === 'undefined') ? false : end;

			if(self.vidp.vid.prop('paused') && !end) {

				self.vidp.msg.fadeOut(200);

				self.vidp.ovr.fadeOut(200, function(){

					self.vidp.vid[0].play();

					v.plbk = true;
					if(typeof cb === 'function'){
						cb();
					}
				});

			} else {

				if (self.elem.data('id') !== null) {

					self.vidp.vid[0].pause();

					self.vidp.msg.fadeOut(200);

					

					if (end) {

						self.vidp.vid.prop('currentTime', 0);

					}

					

					v.plbk = false;



					$.proxy(self.utils.setPoster, self, null, function(){

						self.vidp.ovr.fadeIn(200, function(){

							self.elem.trigger( (end ? 'adPlayerEnd' : 'adPlayerPause') );
							if(typeof cb === 'function'){
								cb();
							}

						});

					})();

				}

			}

		},

		seek: function(val, cb) {

			var self = this;



			self.vidp.vid.prop('currentTime', val);



			setTimeout( function() {

				self.vidp.vid.hide();

				self.vidp.blr.fadeOut(200, function(){

					$.proxy(self.utils.setPoster, self, null, function(){

						self.vidp.blr.fadeIn(200, function(){

							self.vidp.vid.show();

							

							if (typeof cb === 'function') {

								cb();

							}

						});

					})();

				});

			}, 500);

		},

		attachEvents: function(player) {

			var self = this, v = self.vals;



			if(player) {

				self.vidp.vid.on('timeupdate', $.proxy(self.utils.updateTime, self));

				self.vidp.vid.on('ended', $.proxy(self.play, self, true));

				//self.vidp.vid.on('click', $.proxy(self.play, self, false));



				if(!v.browser.ie && !v.browser.chrome) {

					self.vidp.vid.on('waiting', $.proxy(self.utils.wait, self, true));

				} else {

					v.check = setInterval($.proxy(self.utils.bufferCheck, self), 1000);

					self.vidp.vid.on('progress', $.proxy(self.utils.updateBuffer, self));

				}



				//self.vidp.ovr.on('click', $.proxy(self.play, self, false));

			} else {

				$(window).on('resize', $.proxy(self.utils.setSize, self));

			}

		},

		utils: {

			updateTime: function() {

				var self = this, v = self.vals;



				v.time = self.vidp.vid.prop('currentTime');



				if(self.options.groups) {

					for (var i = 0; i < self.options.groups.length; i++) {

						if (self.options.groups[i] != null && v.time >= self.options.groups[i]) {

							self.elem.data('id', i);

						}



						if (self.options.groups[i + 1] > v.time) {

							break;

						}

					}

				}

			},

			bufferCheck: function() {

				var self = this, v = self.vals, time_c = self.vidp.vid.prop('currentTime');



				if (!self.vidp.vid.prop('paused')) {

					if (v.time == time_c) {

						if (!v.wait) {

							v.wait = true;

							$.proxy(self.utils.wait, self, true)();

							

						}

					} else {

						if (v.wait) {

							v.wait = false;

							$.proxy(self.utils.wait, self, false)();

						}

					}

				}

			},

			updateBuffer: function(e) {

				var self = this, v = self.vals, vid = self.vidp.vid[0], buffer = null;



				if (vid.buffered && vid.buffered.length > 0 && vid.buffered.end && vid.duration) {

					buffer = vid.buffered.end(0) / vid.duration;

				} else if (vid.bytesTotal != undefined && vid.bytesTotal > 0 && vid.bufferedBytes != undefined) {

					buffer = vid.bufferedBytes / vid.bytesTotal;

				}

				

				if (buffer == 1) {

					window.clearInterval(v.check);

				}

			},

			setSize: function() {

				var self = this, v = self.vals, w = $(window).width(), h = $(window).height(), isW = w >= (h * 1.7778);

				

				v.w = isW ? w : Math.round(h * 1.7778);

				v.h = isW ? Math.round(w * 0.5625) : h;

				v.ol = Math.round((w - v.w) / 2);

				v.ot = Math.round((h - v.h) / 2);

				

				self.vidp.blr.css({ width: v.w + 'px', height: v.h + 'px', left: v.ol + 'px', top: v.ot + 'px' });

				

				if (self.vidp.vid) {

					self.vidp.vid[0].width = v.w;

					self.vidp.vid[0].height = v.h;



					self.vidp.vid.css({ left: v.ol + 'px', top: v.ot + 'px' });

				}

			},

			setPoster: function(poster, cb) {

				var self = this, v = self.vals;



				if (poster) {

					var img = new Image();



					img.onload = function(){

						self.vidp.con.drawImage(img, 0, 0, v.cnvw, v.cnvh);

					}



					img.src = poster;

				} else {

					self.vidp.con.drawImage(self.vidp.vid[0], 0, 0, v.cnvw, v.cnvh);

					stackBoxBlur(self.vidp.blr[0], 0, 0, v.cnvw, v.cnvh, 8);

					

					if (typeof cb === 'function') {

						cb();

					}

				}

			},

			wait: function(toggle) {

				var self = this;

				

				if (toggle) {

					self.vidp.msg.html('<img src="assets/images/loader.gif"><br>Buffering...');



					self.vidp.vid.on('canplay', $.proxy(self.utils.wait, self, false));

				} else {

					self.vidp.vid.off('canplay');

				}



				self.vidp.msg[ toggle ? 'fadeIn' : 'fadeOut' ](200);

			}

		}

	};



	// Expose the plugin

	$.fn.adPlayer = function (argA, argB, argC) {

		return this.each(function () {

			var player = $.data(this, 'adPlayer');



			if (!player) {

				player = Object.create(oPlayer);
				console.log(player);

				player.init(this, argA);



				$.data(this, 'adPlayer', player);

			} else {

				if (player[argA]) {

					return player[argA](argB, argC);

				}

			}

		});

	};



	// Default options

	$.fn.adPlayer.defaults = {

		video: null,		// Video URL

		poster: null,		// Poster URL

		groups: null		// Products groups for the video

	};

})(jQuery, window, document);