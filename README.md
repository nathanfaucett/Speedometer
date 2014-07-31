Speedometer
=====


##Members

####Speedometer.current
current percent done

####Speedometer.total
the total you passed, defaults to 100

##Functions

####Speedometer.set function (Number)
sets value and renders Speedometer

####Speedometer.setWidth function (Number)
sets width of Speedometer

####Speedometer.setHeight function (Number)
sets height of Speedometer

##Events
pass functions in options or set them on options for them to be called
Speedometer instance bound to events

####Speedometer.onstart
called when animation starts

####Speedometer.onend
called when animation ends

####Speedometer.onupdate
called during animation


##Usage

```javascript
var speedometer = new Speedometer({
  id: "speedometer",

  backgroundColor: "#d1d1d1",
  barColor: "#ff8800",
  
  easing: "easeOutElastic",
  
  duration: 2000,
  height: 256,
  value: 50,
  total: 100,
  
  onstart: function() {
    info.innerHTML = "ON START";
  },
  
  onend: function() {
    info.innerHTML = "ON END";
  },
  
  onupdate: function() {
    var value = this.current * this.total;
    
    count.innerHTML = (value * 100 | 0) / 100 +"/"+ this.total;
  }
});
```