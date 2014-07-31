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

##Events
set functions to values for them to be called

####Speedometer.onload
called after image has been loaded

####Speedometer.onupdate
called during animation


##Usage

```javascript
var speedometer = new Speedometer({
  id: "speedometer", // id of element to put Speedometer in
  height: 256, // height of canvas
  value: 0,
  total: 100,
  backgroundColor: "#ddd",
  barColor: "#ff8800"
});


speedometer.onload = function() {
  speedometer.set(75);
};

speedometer.onupdate = function() {
  console.log(speedometer.current * speedometer.total);
};
```