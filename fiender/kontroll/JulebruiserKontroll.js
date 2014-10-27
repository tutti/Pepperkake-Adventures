JulebruiserKontroll = function() {
    
}

JulebruiserKontroll.prototype = Object.create(Kontroll.prototype);
JulebruiserKontroll.prototype.constructor = JulebruiserKontroll

JulebruiserKontroll.prototype.styr = function(enhet) {
    // Gå et steg
    enhet.beveg();
    
    // Hvis enden av plattformen er nær, stopp.
    if (this.gar_av_plattform(enhet)) {
        enhet.sett_retning(0);
    }
    
    // Hvis spilleren er innenfor rekkevidde, angrip.
    if (enhet.innenfor_rekkevidde(Spill.spiller)) {
        enhet.angrip();
    }
    
    // Hvis spilleren er på samme plattform, begynn å gå mot spilleren.
    else if (enhet.plattform == Spill.spiller.plattform) {
        enhet.sett_retning_mot(Spill.spiller);
    }
}

Kontroll.sett("julebruiser", new JulebruiserKontroll());