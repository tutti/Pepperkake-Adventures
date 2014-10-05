Spiller = new Enhet("bilder/spiller.png");

Spiller.hastighet = 12;
Spiller.hoppstyrke = 20;
Spiller.status = "normal";
Spiller.type = "spiller";
Spiller.bredde = 32;
Spiller.hoyde = 32;

Spiller.sett_kontroll(new SpillerKontroll());

Spiller.tick = function() {
    if (this.status == "luft") {
        this.flytt(this.retning * this.hastighet, -this.momentum);
        this.momentum -= Spill.gravitasjon;
        // TODO: Land på plattform
    }
    else if (this.status == "angrep") {
        // TODO: Angrip
    }
    else if (this.kontroll) {
        this.kontroll.styr(this);
    }
    
}

Spiller.beveg = function(retning) {
    this.sett_retning(retning);
    this.flytt(retning * this.hastighet, 0)
}

Spiller.angrip = function() {
    // TODO: Implementer
}