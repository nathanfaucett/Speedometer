(function speedometer(window, document, undefined) {
    /*
     * polyfills and helpers
     */
    var performance = window.performance || {},

        MAIN_MASK = "data:image/png;base64,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",
        OVER_MASK = "data:image/png;base64,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",

        RATIO = 1.4310344827586208,
        RATE = 1000 / 60,
        START_MS, now, easing;

    Date.now || (Date.now = function now() {
        return (new Date()).getTime();
    });

    START_MS = Date.now();

    performance.now = performance.now || (
        performance.mozNow ||
        performance.msNow ||
        performance.oNow ||
        performance.webkitNow ||
        function now() {
            return Date.now() - START_MS;
        }
    );

    now = function now() {
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

    function Timer() {
        this.delta = 0;
        this.time = 0;
        this.current = 0;
    }

    /*
     * easing functions from http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js
     */
    easing = {
        easeInQuad: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function(t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function(t, b, c, d) {
            var s = 1.70158,
                p = 0,
                a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function(t, b, c, d) {
            var s = 1.70158,
                p = 0,
                a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function(t, b, c, d) {
            var s = 1.70158,
                p = 0,
                a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function(t, b, c, d) {
            return c - easing.easeOutBounce(d - t, 0, c, d) + b;
        },
        easeOutBounce: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce: function(t, b, c, d) {
            if (t < d / 2) return easing.easeInBounce(t * 2, 0, c, d) * .5 + b;
            return easing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };

    /*
     * Speedometer(options Object)
     *   options
     *     id - String (document id selector) uses getElementById to find, defaults to "speedometer"
     *     height - Number height of speedometer, defaults to 256 width based off height to maintain ratio
     *     total - max number the speedometer can be, defaults to 100
     *     value - starting value clamps within total and 0, defaults to 0
     *     backgroundColor
     *     barColor
     *     duration - total time of animation
     *     easing - String type of animation, defaults to easeOutBounce
     */
    function Speedometer(options) {
        if (!(this instanceof Speedometer)) return new Speedometer(options);
        options || (options = {});

        this.element = document.getElementById((typeof(options.id) === "string" ? options.id : "speedometer"));

        this.height = (options.height = +options.height) ? options.height : 256;
        this.width = this.height * RATIO | 0;

        this.backgroundColor = typeof(options.backgroundColor) === "string" ? options.backgroundColor : "#ddd";
        this.barColor = typeof(options.barColor) === "string" ? options.barColor : "#ff8800";

        this.canvas = null;
        this.ctx = null;

        this.duration = ((options.duration = +options.duration) && options.duration > 0) ? options.duration : 1000;
        this.easing = easing[options.easing] || easing.easeOutBounce;

        this.total = ((options.total = +options.total) && options.total > 0) ? options.total : 100;
        this.value = 0;

        this.diff = 0;
        this.to = 0;
        this.from = 0;
        this.current = 0;

        this.timer = new Timer();

        this._mainMask = new Image();
        this._overMask = new Image();

        this._run = false;
        this._requestId = null;

        var _this = this,
            timer = this.timer;

        this._update = function _update() {
            var last = timer.current;

            timer.current = now();
            timer.delta = timer.current - last;

            _this.draw();

            if (_this._run) {
                _this._requestId = window.requestAnimationFrame(_this._update, _this.canvas);
            }
        }

        this.onupdate = options.onupdate;
        this.onstart = options.onstart;
        this.onend = options.onend;

        return this.init(
            ((options.value = +options.value) && options.value > 0) ? (options.value <= this.total ? options.value : this.total) : 0
        );
    }

    Speedometer.prototype.init = function(value) {
        var _this = this,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            tasks = 2;

        canvas.width = this.width;
        canvas.height = this.height;

        ctx.translate(this.width * 0.5, this.height * 0.5);

        this.canvas = canvas;
        this.ctx = ctx;

        this.element.appendChild(canvas);

        this._mainMask.src = MAIN_MASK;
        this._overMask.src = OVER_MASK;

        this.set(value);

        return this;
    };

    Speedometer.prototype.clear = function() {
        var canvas = this.canvas;

        this.element = null;
        this.ctx = null;
        this.canvas = null;

        this._mainMask = null;
        this._overMask = null;

        canvas.parentNode.removeChild(canvas);

        return this;
    };

    Speedometer.prototype.start = function() {
        if (!this._requestId) {
            this.timer.current = now() - RATE;
            this._run = true;
            this._update();
        }
        this.onstart && this.onstart.call(this);
        return this;
    };

    Speedometer.prototype.stop = function() {
        if (this._requestId) {
            window.cancelAnimationFrame(this._requestId);
            this._requestId = null;
            this._run = false;
        }
        this.onend && this.onend.call(this);
        return this;
    };

    Speedometer.prototype.setWidth = function(value) {
        var canvas = this.canvas;

        canvas.width = this.width = +value || this.width;
        canvas.height = this.height = this.width / RATIO;

        this.ctx.translate(this.width * 0.5, this.height * 0.5);

        this.draw();

        return this;
    };

    Speedometer.prototype.setHeight = function(value) {
        var canvas = this.canvas;

        canvas.height = this.height = +value || this.height;
        canvas.width = this.width = this.height * RATIO;

        this.ctx.translate(this.width * 0.5, this.height * 0.5);

        this.draw();

        return this;
    };

    /*
     * set(value Number)
     * sets speedometer value and renders speedometer
     */
    Speedometer.prototype.set = function(value) {
        var total = this.total,
            prev = this.value,
            diff;

        value = +value;
        value = value < 0 ? 0 : (value > total ? total : value);

        this.value = value;

        this.to = value / total;
        this.from = prev / total;
        diff = this.to - this.from;

        this.diff = diff;
        this.timer.time = 0;

        this.start();

        return this;
    };

    Speedometer.prototype.draw = function() {
        var ctx = this.ctx,
            timer = this.timer,
            w = this.width,
            h = this.height,
            hw = w * 0.5,
            hh = h * 0.5,
            mainMask = this._mainMask,
            overMask = this._overMask;

        timer.time += timer.delta;

        this.current = this.easing(timer.time, this.from, this.diff, this.duration);

        if (timer.time >= this.duration) {
            this.stop();
            this.current = this.to
        }

        this.onupdate && this.onupdate.call(this);

        ctx.clearRect(-hw, -hh, w, h);

        ctx.save();

        ctx.drawImage(mainMask, 0, 0, mainMask.width, mainMask.height, -hw, -hh, w, h);
        ctx.globalCompositeOperation = "source-in";

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(-hw, -hh, w, h);

        ctx.globalCompositeOperation = "source-atop";
        drawBar(this, ctx, w, h);

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(overMask, 0, 0, overMask.width, overMask.height, -hw, -hh, w, h);
        drawArrow(this, ctx, w, h);

        ctx.restore();

        return this;
    };

    function drawBar(_this, ctx, w, h) {
        if (_this.current <= 0) return;
        var offset = h * 0.215,
            lineWidth = w * 0.125,
            r = h * 0.65,
            angle = (Math.PI * 0.875) + (_this.current * Math.PI * 1.25),
            x = 0,
            y = offset;

        ctx.save();

        ctx.strokeStyle = _this.barColor;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.arc(x, y, r, Math.PI * 0.872, angle, false);
        ctx.stroke();

        ctx.fillStyle = this.backgroundColor;
        ctx.beginPath();
        ctx.arc(x - (w * 0.03), y, r * 0.975, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.restore();
    }

    function drawArrow(_this, ctx, w, h) {
        var offset = h * 0.215,
            angle = (Math.PI * -0.625) + (_this.current * Math.PI * 1.25),
            x = 0,
            y = offset;

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);

        ctx.fillStyle = _this.backgroundColor;

        ctx.beginPath();
        ctx.moveTo(-w * 0.025, y);
        ctx.lineTo(w * 0.025, y);
        ctx.lineTo(w * 0.005, y - h * 0.5);
        ctx.lineTo(-w * 0.005, y - h * 0.5);
        ctx.fill();

        ctx.restore();
    }

    window.Speedometer = Speedometer;

}(window, document, void 0));
