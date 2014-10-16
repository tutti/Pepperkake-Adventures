GelebolleKontroll = function() {
    
}

GelebolleKontroll.prototype = Object.create(Kontroll.prototype);
GelebolleKontroll.prototype.constructor = GelebolleKontroll

GelebolleKontroll.prototype.styr = function(enhet) {
    // Gå et steg
    enhet.beveg(enhet.retning);
    
    // Hvis enden av plattformen er nær, snu.
    if (this.gar_av_plattform(enhet)) {
        //enhet.retning *= -1;
        enhet.sett_retning(enhet.retning * -1);
    }
}

Kontroll.sett("gelebølle", new GelebolleKontroll());