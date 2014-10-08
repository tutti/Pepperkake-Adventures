Spiller = new Enhet("bilder/spiller.png");

Spiller.sett_bilde("stopp", "bilder/spiller.png");
Spiller.sett_bilde("venstre", "bilder/spiller-v.gif");
Spiller.sett_bilde("høyre", "bilder/spiller-h.gif");

Spiller.hastighet = 12;
Spiller.hoppstyrke = 20;
Spiller.status = "normal";
Spiller.type = "spiller";
Spiller.bredde = 32;
Spiller.hoyde = 32;

Spiller.punkt_x = function() { return this.x + (this.bredde / 2) }
Spiller.punkt_y = function() { return this.y + this.hoyde }

Spiller.sett_kontroll(new SpillerKontroll());

Spiller.tick = function() {
    Enhet.prototype.tick.call(this);
    
    $("#spillvindu").scrollLeft(this.punkt_x() - 400);
    if (this.punkt_x() > 400 && this.punkt_x() < $("#spillvindu")[0].scrollWidth - 400) {
        $("#spillvindu").css('background-position', -(this.punkt_x()-400)/5);
    }
}

//Spiller.beveg = function(retning) {
//    this.sett_retning(retning);
//    this.flytt(retning * this.hastighet, 0)
//    if (!this.plattform) {
//        this.momentum = 0;
//        this.status = "luft";
//    }
//    else if (!this.plattform.er_pa(this.punkt_x())) {
//        this.plattform.fjern(this);
//        this.plattform = null;
//        this.momentum = 0;
//        this.status = "luft";
//    }
//}

Spiller.angrip = function() {
    // TODO: Implementer
}