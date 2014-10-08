//Spiller = new Enhet("bilder/spiller.png");

Spiller = function() {
    Enhet.call(this, "bilder/spiller.png");
    
    this.sett_bilde("stopp", "bilder/spiller.png");
    this.sett_bilde("venstre", "bilder/spiller-v.gif");
    this.sett_bilde("høyre", "bilder/spiller-h.gif");
    
    this.hastighet = 8;
    this.hoppstyrke = 20;
    this.status = "normal";
    this.type = "spiller";
    this.bredde = 32;
    this.hoyde = 32;
    
    this.sett_kontroll(Kontroll.hent("spiller"));
}

Spiller.prototype = Object.create(Enhet.prototype);
Spiller.prototype.constructor = Spiller

Spiller.prototype.sett_retning = function(retning) {
    Enhet.prototype.sett_retning.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("venstre");
            break;
        case 1:
            this.velg_bilde("høyre");
            break;
        case 0:
            this.velg_bilde("stopp");
            break;
    }
}

Spiller.prototype.angrip = function() {
    // TODO: Implementer
}

Spiller.prototype.skade = function(skade, retning, kraft) {
    this.fall();
    this.retning = 0;
    this.momentum = (this.hoppstyrke * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    this.status = "luft";
}