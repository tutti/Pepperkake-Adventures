Spiller = new Enhet("bilder/spiller.png");

Spiller.hastighet = 12;
Spiller.hoppstyrke = 20;
Spiller.status = "normal";
Spiller.type = "spiller";
Spiller.bredde = 32;
Spiller.hoyde = 32;

Spiller.gamle_punkt_x = 0;
Spiller.gamle_punkt_y = 0;

Spiller.punkt_x = function() { return this.x + (this.bredde / 2) }
Spiller.punkt_y = function() { return this.y + this.hoyde }

Spiller.sett_kontroll(new SpillerKontroll());

Spiller.tick = function() {
    if (this.status == "luft") {
        var x1 = this.punkt_x();
        var y1 = this.punkt_y();
        this.flytt(this.retning * this.hastighet, -this.momentum, false);
        this.momentum -= Spill.gravitasjon;
        if (this.momentum <= 0) {
            var x2 = this.punkt_x();
            var y2 = this.punkt_y();
            var plattform = Spill.brett.land(this.gamle_punkt_x, this.gamle_punkt_y, x2, y2);
            if (plattform) {
                this.plattform = plattform;
                plattform.legg_til(this);
                this.status = "normal";
                this.y = this.plattform.y - this.hoyde;
            }
        }
        this.gamle_punkt_x = x1;
        this.gamle_punkt_y = y1;
        this.oppdater();
    }
    else if (this.status == "angrep") {
        // TODO: Angrip
    }
    else if (this.kontroll) {
        this.kontroll.styr(this);
    }
    
    $("#spillvindu").scrollLeft(this.punkt_x() - 400);
    if (this.punkt_x() > 400 && this.punkt_x() < $("#spillvindu")[0].scrollWidth - 400) {
        $("#spillvindu").css('background-position', -(this.punkt_x()-400)/5);
    }
}

Spiller.beveg = function(retning) {
    this.sett_retning(retning);
    this.flytt(retning * this.hastighet, 0)
    if (!this.plattform) {
        this.momentum = 0;
        this.status = "luft";
    }
    else if (!this.plattform.er_pa(this.punkt_x())) {
        this.plattform.fjern(this);
        this.plattform = null;
        this.momentum = 0;
        this.status = "luft";
    }
}

Spiller.angrip = function() {
    // TODO: Implementer
}