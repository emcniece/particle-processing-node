var http = require('http');
var express = require('express');
var app = express();
//var SerialPort = require("serialport").SerialPort;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var server = http.createServer(app).listen(3000);
var io = require('socket.io').listen(server);

var cBlack = {r:0,g:0,b:0};
var leds = new Array(12);
var oldPattern = "";

app.use(express.static(__dirname + '/public'));

// replace this address with your port address
var sp = new SerialPort("COM5", {
	baudrate:921600,
	parser: serialport.parsers.readline("\n")
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

// Init graph - happens each socket write
function resetGraph(){
	for(var i=0;i<leds.length;i++){
		leds[i] = {
			client: [],
			color: cBlack
		};
	}
}
resetGraph();

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}


sp.on('open', function(error){
	if(error){
		console.log('Failed to open: '+error);
		return;
	}
	// Now server is connected to Arduino
	console.log('Serial Port Opened');

	var lastValue;
	io.sockets.on('connection', function (socket) {
		//Connecting to client
		console.log('Socket connected');
		socket.emit('connected');
		var lastValue;

		sp.on('data', function(data){
			console.warn('data received: ', data);
			if( "Clear" == data.trim() ){
				console.log("Clearing...");
				resetGraph();
			}
		});

		// Merge client LED data into set
		socket.on('tick', function(data){
			for(var i=0;i<leds.length;i++){

				// Clear out previous color from this client
				if( (i !== data.led) && (leds[i].client.indexOf(socket.id) > -1 ) ){
					leds[i].client.remove( socket.id);
					if( !leds[i].client.length)	leds[i].color = cBlack;
				}

				// If taken, combine colors
				if( (i === data.led) && (leds[i].client.length) && (leds[i].client.indexOf(socket.id) === -1) ){
					var combR = data.color.r + leds[i].color.r;
					var combG = data.color.g + leds[i].color.g;
					var combB = data.color.b + leds[i].color.b;

					leds[i].color ={
						r: (combR > 255) ? 255 : combR,
						g: (combG > 255) ? 255 : combG,
						b: (combB > 255) ? 255 : combB,
					}

					leds[i].client.push(socket.id);
				}

				// If updating the same color, push color again
				if( (i === data.led) && (leds[i].client.length === 1) && (leds[i].client.indexOf(socket.id) > -1) ){
					leds[i].color = data.color;
				}

				// If not taken, set new color for this client
				if( (i === data.led) && (!leds[i].client.length) && (leds[i].client.indexOf(socket.id) === -1) ){
					leds[i].color = data.color;
					leds[i].client.push(socket.id);
				}

			}
			//socket.emit('lightUpdate', leds);
		});

		setInterval(function(){
			var newPattern = "";
			var pixels = new Uint8ClampedArray( (leds.length*4) ); // LED #, Red, green, blue

			for(var i=0;i<leds.length;i++){
				if( typeof(leds[i].color.r) !== 'undefined'){
						pixels[i*4] = i;
						pixels[(i*4)+1] = leds[i].color.r.clamp(0,254);
						pixels[(i*4)+2] = leds[i].color.g.clamp(0,254);
						pixels[(i*4)+3] = leds[i].color.b.clamp(0,254);
				}
			}

			newPattern = JSON.stringify(pixels);
			if( oldPattern !== newPattern){
				sp.write(pixels);
				oldPattern = newPattern;
			} else{
				//console.log('Skipping same pattern')
			}

		}, 50);

	});


});