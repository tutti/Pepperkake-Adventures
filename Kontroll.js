Kontroll = function() {
    
}

Kontroll.prototype.styr = function(enhet) {
    // Velger styring for enheten for et tick
}

// Konstanter for tastene som brukes
Kontroll.SPACE = Kontroll.MELLOMROM = 32;
Kontroll.VENSTRE = 37;
Kontroll.OPP = 38;
Kontroll.HOYRE = 39;
Kontroll.NED = 40;

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

// Nyttige funksjoner for kontroller

Kontroll.prototype.gar_av_plattform = function(enhet) {
    if (!enhet.plattform) return false;
    if ((enhet.retning == -1 && (enhet.plattform.x > (enhet.punkt_x() - enhet.hastighet)))
        || (enhet.retning == 1 && (enhet.plattform.x + enhet.plattform.bredde) < (enhet.punkt_x() + enhet.hastighet))) {
        return true;
    }
    return false;
}

// Kode for å gjøre kontroller tilgjengelig uten å opprette nye objekter for dem

var kontroller = {}

Kontroll.sett = function(navn, kontroll) {
    kontroller[navn] = kontroll;
}

Kontroll.hent = function(navn) {
    return kontroller[navn];
}