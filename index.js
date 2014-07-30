(function speedometer(window, document, undefined) {
	var performance = window.performance || {},
		RATE = 1000 / 60,
		START_MS, now;

    Date.now || (Date.now = function now() {
        return (new Date()).getTime();
    });
	
    START_MS = Date.now();

    performance.now || (performance.now =
        performance.mozNow ||
        performance.msNow ||
        performance.oNow ||
        performance.webkitNow ||
        function now() {
            return Date.now() - START_MS;
        }
    );

    now = function() {
        return performance.now();
    };
	
	window.requestAnimationFrame = window.requestAnimationFrame || (
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function requestAnimationFrame(callback) {

			return window.setTimeout(callback, RATE);
		}
	);
	
	window.cancelAnimationFrame = window.cancelAnimationFrame || (
		window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
		window.clearTimeout
	);

	/*
	 * Speedometer(options Object)
	 *   options {
	 *     id: String (document id selector) uses getElementById to find defaults to "speedometer"
	 *     width: Number width of speedometer defaults to 256
	 *     height: Number height of speedometer defaults to 256
	 *     total: max number the speedometer can be defaults to 100
	 *   }
	 */
	function Speedometer(options) {
		if (!(this instanceof Speedometer)) return new Speedometer(options); 
		options || (options = {});
		
		this.element = document.getElementById((typeof(options.id) === "string" ? options.id : "speedometer"));
		
		this.width = options.width === +options.width ? options.width : 256;
		this.height = options.height === +options.height ? options.height : 256;
		
		this.canvas = null;
		this.ctx = null;
		
		this.total = ((options.total = +options.total) && options.total > 0) ? options.total : 100;
		this.value = 0;
		this.percent = 0.0;
		this.current = 0.0;
		this.difference = 0.0;
		
		this.dt = 1 / 60;
		this.requestId = null;
		
		var _this = this,
			current = 0,
			last = -1/60;
		this._update = function _update() {
			last = current;
			current = now();
			_this.dt = (current - last) * 0.001;
			
			_this.draw();
			_this.requestId = window.requestAnimationFrame(_this._update, _this.canvas);
		}
		
		return this.init(((options.value = +options.value) && options.value > 0) ? (options.value <= this.total ? options.value : this.total) : 0);
	}
	
	Speedometer.prototype.init = function(value) {
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");
		
		canvas.width = this.width;
		canvas.height = this.height;
		
		ctx.translate(this.width * 0.5, this.height * 0.5);
		ctx.scale(1, -1);
		
		this.canvas = canvas;
		this.ctx = ctx;
		
		this.element.appendChild(canvas);
		
		this.set(value);
		
		return this;
	};
	
	Speedometer.prototype.start = function() {
		if (!this.requestId) {
			this._update();
		}
	};
	
	Speedometer.prototype.stop = function() {
		if (this.requestId) {
			window.cancelAnimationFrame(this.requestId);
			this.requestId = null;
		}
	};
	
	/*
	 * set(value Number)
	 * sets speedometer value and renders speedometer
	 */
	Speedometer.prototype.set = function(value) {
		var total = this.total,
			prev = this.value;
	
		value = +value;
		value = value < 0 ? 0 : (value > total ? total : value);
		
		this.value = value;
		this.percent = value / total;
		this.difference = (value - prev)  / total;
		
		this.start();
		
		return this;
	};
	
	Speedometer.prototype.draw = function() {
		var ctx = this.ctx,
			radius = (this.height - 2) * 0.5;
		
		if (this.current >= this.difference) {
			this.stop();
			return this;
		}
		this.current += this.difference * this.dt;
		
		ctx.clearRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
		
		this.drawArrow();
		
		ctx.save();
		
		ctx.beginPath();
		ctx.arc(0, 0, radius, Math.PI * -0.125, Math.PI * -0.8625, false);
		ctx.stroke();
		
		ctx.restore();
		
		return this;
	};
	
	Speedometer.prototype.drawArrow = function() {
		var ctx = this.ctx,
			width = (this.width - 2) * 0.0425,
			height = (this.height - 2) * 0.5;
		
		ctx.save();
		
		ctx.fillStyle = "#ddd";
		
		ctx.rotate((this.current * Math.PI * 1.25) + Math.PI * 0.625);
		
		ctx.beginPath();
		ctx.moveTo(0, height);
		ctx.lineTo(-width, 0);
		ctx.lineTo(width, 0);
		ctx.closePath();
		ctx.fill();
		
		ctx.restore();
		
		return this;
	};
	
	window.Speedometer = Speedometer;
	
}(window, document, void 0));