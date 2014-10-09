SpillerKontroll = function() {
    
}

SpillerKontroll.prototype = Object.create(Kontroll.prototype);
SpillerKontroll.prototype.constructor = SpillerKontroll

SpillerKontroll.prototype.styr = function(enhet) {
    // 37 venstre, 39 høyre, 38 opp, 40 ned, 32 space
    switch (enhet.status) {
        case "luft":
            //if (this.er_tast(37)) {
            //    enhet.beveg(-1);
            //} else if (this.er_tast(39)) {
            //    enhet.beveg(1);
            //}
            if (this.er_tast(32)) {
                enhet.angrip();
            }
            break;
        case "normal":
        default:
            if (this.er_tast(37)) {
                enhet.beveg(-1);
            } else if (this.er_tast(39)) {
                enhet.beveg(1);
            } else {
                enhet.beveg(0);
            }
            
            if (this.er_tast(38)) {
                enhet.hopp();
            } else if (this.er_tast(40)) {
                enhet.fall();
            } else if (this.er_tast(32)) {
                enhet.angrip();
            }
            break;
    }
}

Kontroll.sett("spiller", new SpillerKontroll());