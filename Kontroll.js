Kontroll = function() {
    
}

Kontroll.prototype.styr = function(enhet) {
    // Velger styring for enheten for et tick
}

// Koden som kontrollerer tastestyring

var taster = {
    
}

function keyDown(event) {
    var tast = event.which;
    taster[tast] = true;
}

function keyUp(event) {
    var tast = event.which;
    taster[tast] = false;
}

$(document).ready(function() {
    $(document).keydown(keyDown);
    $(document).keyup(keyUp);
})

Kontroll.prototype.er_tast = function(tast) {
    if (taster[tast]) return true;
    return false;
}

var kontroller = {
    
}

Kontroll.sett = function(navn, kontroll) {
    kontroller[navn] = kontroll;
}

Kontroll.hent = function(navn) {
    return kontroller[navn];
}