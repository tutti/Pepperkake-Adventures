Julebruiser = function(x, y) {
    this.type = "julebruiser";
    this.antall_farger = 0;
    Enhet.call(this, "bilder/julebruiser.png", x, y);
    
    this.sett_bilde("gå-venstre", "bilder/julebruiser.png");
    this.sett_bilde("gå-høyre", "bilder/julebruiser.png");
    
    this.bredde = 32;
    this.hoyde = 32;
    this.hastighet = 15;
    this.hoppstyrke = 15;
    this.original_retning = 0;
    this.maxhp = 3;
    
    this.sett_kontroll(Kontroll.hent("julebruiser"));
}

Julebruiser.prototype = Object.create(Enhet.prototype);
Julebruiser.prototype.constructor = Julebruiser

Julebruiser.prototype.sett_retning = function(retning) {
    Enhet.prototype.sett_retning.call(this, retning);
    switch (retning) {
        case -1:
            this.velg_bilde("venstre");
            break;
        case 1:
            this.velg_bilde("høyre");
            break;
    }
}

Julebruiser.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    //Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, this.retning, 1.5);
}

Julebruiser.prototype.angrep_tick = function() {
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

Julebruiser.prototype.angrip = function() {
    this.angrep = true;
    this.angrep_teller = 25;
}

Julebruiser.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.momentum = (20 * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}

Enhet.registrer("julebruiser", Julebruiser);