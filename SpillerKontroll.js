SpillerKontroll = function() {
    
}

SpillerKontroll.prototype = Object.create(Kontroll.prototype);
SpillerKontroll.prototype.constructor = SpillerKontroll

SpillerKontroll.prototype.styr = function(enhet) {
    if (enhet.status == "normal") {
        if (this.er_tast(Kontroll.VENSTRE)) {
            enhet.beveg(-1);
        } else if (this.er_tast(Kontroll.HOYRE)) {
            enhet.beveg(1);
        } else {
            enhet.beveg(0);
        }
        
        if (this.er_tast(Kontroll.OPP)) {
            enhet.hopp();
        } else if (this.er_tast(Kontroll.NED)) {
            enhet.fall();
        } else if (this.er_tast(Kontroll.SPACE)) {
            enhet.angrip();
        }
    } else if (enhet.status == "luft" && this.er_tast(Kontroll.SPACE)) {
        enhet.angrip();
    }
}

Kontroll.sett("spiller", new SpillerKontroll());