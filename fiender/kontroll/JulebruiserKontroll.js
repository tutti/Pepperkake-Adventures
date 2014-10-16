JulebruiserKontroll = function() {
    
}

JulebruiserKontroll.prototype = Object.create(Kontroll.prototype);
JulebruiserKontroll.prototype.constructor = JulebruiserKontroll

JulebruiserKontroll.prototype.styr = function(enhet) {
    // Gå et steg
    enhet.beveg(enhet.retning);
    
    // Hvis enden av plattformen er nær, snu.
    if (!enhet.plattform) return;
    if ((enhet.retning == -1 && (enhet.plattform.x > (enhet.punkt_x() - enhet.hastighet)))
        || (enhet.retning == 1 && (enhet.plattform.x + enhet.plattform.bredde) < (enhet.punkt_x() + enhet.hastighet))) {
        enhet.retning *= -1;
    }
    
    if (enhet.innenfor_rekkevidde(Spill.spiller)) {
        enhet.angrip();
    }
}

Kontroll.sett("julebruiser", new JulebruiserKontroll());