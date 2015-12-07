var dialogue = document.getElementById('dialogue');

socket.on('connected', function(){
	dialogue.innerHTML = "Socket Connected";
});
socket.on('disconnect', function(){
	dialogue.innerHTML = "Socket Disconnected";
});

socket.on('lightUpdate', function (data) {
  console.log( data);
});

setInterval(function(){
  socket.emit('tick', {led: nearest, color:{r:fillR, g:fillG, b:fillB} } );
}, 50);

function pEvent(data){
  var val = Math.round(data);
  console.log('angle: ', val );
  socket.emit('angleChange', val );
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';
    ++i; // so we know we aren't using the original object anymore
    return value;
  }
}

jQuery(document).ready(function($){
  $(".pick-a-color").pickAColor({
    showHexInput: false,
    showSpectrum: false,
    showBasicColors: false,
    showAdvanced: false,
    showSavedColors: false
  });

  $("[name='fillColor']").on("change", function () {
    var newColor = hexToRgb($(this).val());
    fillR = newColor.r;
    fillG = newColor.g;
    fillB = newColor.b;
  });

});