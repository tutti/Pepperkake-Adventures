PepperkakeKontroll = function() {
    
}

PepperkakeKontroll.prototype = Object.create(Kontroll.prototype);
PepperkakeKontroll.prototype.constructor = PepperkakeKontroll

PepperkakeKontroll.prototype.styr = function(enhet) {
    
    // Gå et steg
    if (!this.gar_av_plattform(enhet)) {
        enhet.beveg();
    } else {
        enhet.sett_retning(enhet.retning * -1);
    }
    
    // Se om pepperkaken skal snu
    if (!enhet.kontrollticks) {
        enhet.sett_retning(Math.floor(Math.random() * 3) - 1);
        enhet.kontrollticks = Math.floor(Math.random() * 5) + 5
    }
    --enhet.kontrollticks;
}

Kontroll.sett("pepperkake", new PepperkakeKontroll());