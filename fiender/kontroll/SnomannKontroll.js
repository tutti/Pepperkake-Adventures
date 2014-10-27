SnomannKontroll = function() {
    
}

SnomannKontroll.prototype = Object.create(Kontroll.prototype);
SnomannKontroll.prototype.constructor = SnomannKontroll

SnomannKontroll.prototype.styr = function(enhet) {
    //if (enhet.retning == 0) enhet.sett_retning(1);
    
    // Snu mot spiller
    enhet.sett_retning_mot(Spill.spiller);
    
    // Kast en snøball
    enhet.angrip();
    //    if (enhet.retning == 0) enhet.sett_retning(1);
    //
    //// Gå et steg
    //enhet.beveg();
    //
    //// Hvis enden av plattformen er nær, snu.
    //if (this.gar_av_plattform(enhet)) {
    //    //enhet.retning *= -1;
    //    enhet.sett_retning(enhet.retning * -1);
    //}
}

Kontroll.sett("snømann", new SnomannKontroll());