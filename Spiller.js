//Spiller = new Enhet("bilder/spiller.png");

Spiller = function() {
    Enhet.call(this, "bilder/spiller.png", 0, 0);
    
    this.sett_bilde("stopp", "bilder/spiller.png");
    this.sett_bilde("venstre", "bilder/spiller-v.gif");
    this.sett_bilde("høyre", "bilder/spiller-h.gif");
    
    this.hastighet = 8;
    this.hoppstyrke = 20;
    this.status = "normal";
    this.type = "spiller";
    this.bredde = 32;
    this.hoyde = 32;
    this.maxhp = 3;
    this.original_retning = 0;
    
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

Spiller.prototype.tick = function() {
    Enhet.prototype.tick.call(this);
    if (this.status == "luft") {
        this.kontroll.styr(this);
    }
}

Spiller.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    switch (this.retning) {
        case -1:
            Spill.brett.skad(this, this.x - this.rekkevidde, this.y, this.x, this.y + this.hoyde, 1, -1, 1);
            break;
        case 1:
            Spill.brett.skad(this, this.x + this.rekkevidde, this.y, this.x + 2 * this.rekkevidde, this.y + this.hoyde, 1, 1, 1);
            break;
        case 0:
        default:
            Spill.brett.skad(this, this.x - this.rekkevidde / 2, this.y, this.x + this.rekkevidde / 2, this.y + this.hoyde, 1, -1, 1);
            Spill.brett.skad(this, this.x + this.rekkevidde / 2, this.y, this.x + this.rekkevidde * 1.5, this.y + this.hoyde, 1, 1, 1);
            break;
    }
}

Spiller.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.retning = 0;
    this.momentum = (this.hoppstyrke * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}

Spiller.prototype.dod = function() {
    Enhet.prototype.dod.call(this);
    Spill.spiller_dod();
}