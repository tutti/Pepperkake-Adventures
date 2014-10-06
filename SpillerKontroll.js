SpillerKontroll = function() {
    
}

SpillerKontroll.prototype = Object.create(Kontroll.prototype);
SpillerKontroll.prototype.constructor = SpillerKontroll

SpillerKontroll.prototype.styr = function(enhet) {
    // 37 venstre, 39 høyre, 38 opp, 32 space
    if (this.er_tast(37)) {
        enhet.velg_bilde("venstre");
        enhet.beveg(-1);
    } else if (this.er_tast(39)) {
        enhet.velg_bilde("høyre");
        enhet.beveg(1);
    } else {
        enhet.velg_bilde("stopp");
        enhet.beveg(0);
    }
    
    if (this.er_tast(38)) {
        enhet.hopp();
    } else if (this.er_tast(40)) {
        enhet.fall();
    } else if (this.er_tast(32)) {
        enhet.angrip();
    }
}