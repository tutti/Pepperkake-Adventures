SeigeninjaKontroll = function() {
    
}

SeigeninjaKontroll.prototype = Object.create(Kontroll.prototype);
SeigeninjaKontroll.prototype.constructor = SeigeninjaKontroll

SeigeninjaKontroll.prototype.styr = function(enhet) {
    if (enhet.status == "normal") { // Ninja er på plattform
        if (enhet.plattform == Spill.spiller.plattform) { // Spiller er på samme plattform
            if (enhet.innenfor_rekkevidde(Spill.spiller)) { // Spiller er innenfor rekkevidde
                enhet.angrip();
            } else { // Spiller er ikke innenfor rekkevidde
                enhet.beveg_mot(Spill.spiller);
            }
        } else if (Spill.spiller.plattform) { // Spiller er på annen plattform
            if (enhet.trajectory_plattform() == Spill.spiller.plattform) { // Plattformen kan nås med et hopp
                enhet.hopp();
            } else {
                enhet.beveg_mot(Spill.spiller); // TODO: Fiks så ninja ikke kan gå av plattform
            }
        } else if (Spill.spiller.punkt_x() >= enhet.plattform.x
                   && Spill.spiller.punkt_x() <= enhet.plattform.x + enhet.plattform.bredde
                   && Spill.spiller.punkt_y() <= enhet.plattform.y) { // Spiller er over samme plattform
                enhet.beveg_mot(Spill.spiller);
        } else {
            enhet.beveg(0);
        }
    }
}

Kontroll.sett("seigeninja", new SeigeninjaKontroll());