Gelebolle = function(x, y) {
    Enhet.call(this, "bilder/gelebolle.png", x, y);
    
    this.sett_bilde("venstre", "bilder/gelebolle-v.gif");
    this.sett_bilde("høyre", "bilder/gelebolle-h.gif");
    
    this.type = "gelebolle";
    this.bredde = 32;
    this.hoyde = 32;
    this.hastighet = 5;
    this.hoppstyrke = 0;
    this.original_retning = 1;
    //this.retning = 1;
    this.maxhp = 3;
    
    this.sett_kontroll(Kontroll.hent("gelebølle"));
}

Gelebolle.prototype = Object.create(Enhet.prototype);
Gelebolle.prototype.constructor = Gelebolle

Gelebolle.prototype.sett_retning = function(retning) {
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

Gelebolle.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, this.retning, 1.5);
}

Gelebolle.prototype.hopp = function() {
    // Gjør ingenting - gelebøller kan ikke hoppe
}

Gelebolle.prototype.angrip = function() {
    // Gjør ingenting - gelebøller skader ved å røre borti, men kan ikke angripe
}

Gelebolle.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.momentum = (20 * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}