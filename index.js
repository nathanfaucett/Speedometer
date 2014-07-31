(function speedometer(window, document, undefined) {
    var performance = window.performance || {},
        RATIO = 1.4310344827586208,
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

    function easeInOutQuad(b, c, d, t) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function loadImage(src, callback) {
        var image = new Image();

        image.onload = function() {
            callback(null, image);
        };
        image.error = function() {
            callback(new Error("404 Not found"));
        };

        image.src = src;
    }

    /*
     * Speedometer(options Object)
     *   options {
     *     id: String (document id selector) uses getElementById to find, defaults to "speedometer"
     *     height: Number height of speedometer, defaults to 256 width based off height to maintain ratio
     *     total: max number the speedometer can be, defaults to 100
     *   }
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

        this.speed = ((options.speed = +options.speed) && options.speed > 0) ? options.speed : 1;

        this.total = ((options.total = +options.total) && options.total > 0) ? options.total : 100;
        this.value = 0;

        this.diff = 0;
        this.dir = 1;
        this.to = 0;
        this.from = 0;
        this.current = 0;

        this.dt = 1 / 60;
        this._current = 0;

        this._image = null;
        this._run = false;
        this._requestId = null;

        var _this = this;
        this._update = function _update() {
            var last = _this._current;

            _this._current = now();
            _this.dt = (_this._current - last) * 0.001;

            _this.draw();

            if (_this._run) {
                _this._requestId = window.requestAnimationFrame(_this._update, _this.canvas);
            }
        }

        this.onload = null;
        this.onupdate = null;

        return this.init(
            ((options.value = +options.value) && options.value > 0) ? (options.value <= this.total ? options.value : this.total) : 0
        );
    }

    Speedometer.prototype.init = function(value) {
        var _this = this,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

        canvas.width = this.width;
        canvas.height = this.height;

        ctx.translate(this.width * 0.5, this.height * 0.5);

        this.canvas = canvas;
        this.ctx = ctx;

        this.element.appendChild(canvas);

        loadImage("./img/speedometer.png", function(err, image) {

            _this._image = image;
            _this.set(value);
            if (_this.onload) _this.onload();
        });

        return this;
    };

    Speedometer.prototype.clear = function() {
        var canvas = this.canvas;

        this.element = null;
        this.ctx = null;
        this.canvas = null;

        canvas.parentNode.removeChild(canvas);

        return this;
    };

    Speedometer.prototype.start = function() {
        if (!this._requestId) {
            this._current = now();
            this._run = true;
            this._update();
        }
        return this;
    };

    Speedometer.prototype.stop = function() {
        if (this._requestId) {
            window.cancelAnimationFrame(this._requestId);
            this._requestId = null;
            this._run = false;
        }
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
        this.dir = diff < 0 ? -1 : 1;

        this.start();

        return this;
    };

    Speedometer.prototype.draw = function() {
        var ctx = this.ctx,
            dt = this.dt,
            w = this.width,
            h = this.height,
            hw = w * 0.5,
            hh = h * 0.5,
            image = this._image,
            current = 0;

        this.current += this.diff * this.speed * dt;
        current = this.current;

        if (this.dir === 1) {
            if (current >= this.to) {
                this.stop();
                this.current = this.to
            }
        } else {
            if (current <= this.to) {
                this.stop();
                this.current = this.to
            }
        }

        this.onupdate && this.onupdate();

        ctx.clearRect(-hw, -hh, w, h);

        ctx.save();

        ctx.drawImage(image, 0, 0, image.width, image.height, -hw, -hh, w, h);
        ctx.globalCompositeOperation = "source-in";

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(-hw, -hh, w, h);

        ctx.globalCompositeOperation = "source-atop";

        drawBar(this, ctx, dt, w, h);

        ctx.globalCompositeOperation = "source-over";

        drawArrow(this, ctx, dt, w, h);

        ctx.restore();

        return this;
    };

    function drawBar(_this, ctx, dt, w, h) {
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
        ctx.arc(x - (w * 0.03), y, r * 0.95, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.restore();
    }

    function drawArrow(_this, ctx, dt, w, h) {
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
