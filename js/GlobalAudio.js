/*
 * ---------------------------------------------
 * website:
 * filename: BASE.js
 * revision: 1.0
 * createdate: 2014-09-17 17:22
 * author: lc
 * description: 
 * ---------------------------------------------
 */
var BASE = BASE || {};
/**
 * 命名空间函数
 * */
BASE.namespace = function(_name) {
	var parts = _name.split('.'), i, size, parent = BASE;
	if(parts[0] === 'BASE'){
		parts = parts.slice(1);
	}
	size = parts.length;
	for(i = 0; i < size; i++){
		if(typeof parent[parts[i]] === 'undefined'){
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

/**
 * 音频模块
 * */
BASE.namespace('BASE.COM.GlobalAudio');
BASE.COM.GlobalAudio = (function() {
	var defaults    = {
		    wraper   : '#globalAudio',
		    autoplay : true,
		    volume   : 0.5
	    },
	    hasTouch    = 'ontouchstart' in window,
	    addClass    = function(_node, _class) {
		    if(!(new RegExp('(^|\\s+)' + _class + '($|\\s+)')).test(_node.className)){
			    _node.className = _node.className + ' ' + _class;
		    }
	    },
	    removeClass = function(_node, _class) {
		    _node.className = _node.className.replace(new RegExp('(^|\\s+)' + _class + '($|\\s+)'), ' ');
	    },
	    extend      = function(target, options) {
		    for(var i in options){
			    target[i] = options[i];
		    }
	    },
	    init        = function(options) {
		    extend(defaults, options);
		    return new GlobalAudio(defaults);
	    };

	function GlobalAudio(options) {
		this.options = options;
		//容器对象
		this.wraper = document.querySelector(this.options.wraper);
		//文本提示容器
		this.tips = this.wraper.querySelector('span');
		//获取音频控件
		this.audio = this.wraper.querySelector('audio');
		this.readyState = false;
		this.volume = this.options.volume;
		this.firstTouch = !hasTouch;
		this.init();
	}

	GlobalAudio.prototype = {
		init    : function() {
			var that = this;
			this.timer = setInterval(function() {
					var ready = that.audio.readyState;
					document.getElementById('test').innerHTML = ready + '<br>ff';
					if(ready === 4 || ready === 1){
						that.readyState = true;
						removeClass(that.wraper, 'none');
						that.play();
						document.addEventListener('touchstart', function() {
							if(that.firstTouch){
								that.play();
								that.firstTouch = false;
							}
						}, false);
						clearInterval(that.timer);
					}
				}, 100
			)
			;
			that.event();
		},
		event   : function() {
			var that = this;
			this.wraper.addEventListener(hasTouch ? 'touchstart' : 'click', function(e) {
				e.preventDefault();
				if(that.readyState){
					that.audio.paused ? that.play(1) : that.pause();
				}
			}, false);
		}
		,
		play    : function(isTips) {
			if(this.audio.paused){
				this.audio.volume = this.volume;
				this.audio.play();
				addClass(this.wraper, 'play');
				isTips && this.showTip('开启');
				this.start();
			}
		}
		,
		pause   : function() {
			if(!this.audio.paused){
				this.audio.pause();
				removeClass(this.wraper, 'play');
				this.showTip('关闭');
				this.stop();
			}
		}
		,
		showTip : function(txt) {
			var that = this;
			that.tips.innerHTML = txt;
			addClass(that.tips, 'show');
			clearTimeout(that.timeout);
			that.timeout = setTimeout(function() {
				removeClass(that.tips, 'show');
			}, 1000);
		}
		,
		start   : function() {

		}
		,
		stop    : function() {

		}
	}
	;
	return {
		init : init
	}
}());