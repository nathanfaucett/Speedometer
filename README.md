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
  id: "speedometer",
  height: 256,
  value: 50,
  total: 100
});

speedometer.set(75)
```