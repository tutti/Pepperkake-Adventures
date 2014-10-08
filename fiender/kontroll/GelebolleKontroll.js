GelebolleKontroll = function() {
    
}

GelebolleKontroll.prototype = Object.create(Kontroll.prototype);
GelebolleKontroll.prototype.constructor = GelebolleKontroll

GelebolleKontroll.prototype.styr = function(enhet) {
    // Gå et steg
    enhet.beveg(enhet.retning);
    
    // Hvis enden av plattformen er nær, snu.
    if (!enhet.plattform) return;
    if ((enhet.retning == -1 && (enhet.plattform.x > (enhet.punkt_x() - enhet.hastighet)))
        || (enhet.retning == 1 && (enhet.plattform.x + enhet.plattform.bredde) < (enhet.punkt_x() + enhet.hastighet))) {
        enhet.retning *= -1;
    }
}

Kontroll.sett("gelebølle", new GelebolleKontroll());