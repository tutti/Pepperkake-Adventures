Roborudolf = function(x, y) {
    this.type = "roborudolf";
    Enhet.call(this, x, y);
    
    this.bredde = 64;
    this.hoyde = 64;
    this.hastighet = 10;
    this.hoppstyrke = 10;
    this.original_retning = 1;
    this.maxhp = 60;
    
    this.sett_bilde("venstre", "venstre.png");
    this.sett_bilde("høyre", "hoyre.png");
    
    this.sett_kontroll(Kontroll.hent("roborudolf"));
}

Roborudolf.prototype = Object.create(Enhet.prototype);
Roborudolf.prototype.constructor = Roborudolf

Roborudolf.prototype.sett_retning = function(retning) {
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

Roborudolf.prototype.tick = function() {
    if (!this.aktiv) return;
    Enhet.prototype.tick.call(this);
    if (Spill.brett.skad(this, this.x, this.y, this.x+this.bredde, this.y+this.hoyde, 1, this.retning, 1.5)) {
        Lyd.Effekt.spill("lyd/slag1.mp3");
    }
}

//Roborudolf.prototype.hopp = function() {
//    // Gjør ingenting - gelebøller kan ikke hoppe
//}
//
//Roborudolf.prototype.angrip = function() {
//    // Gjør ingenting - gelebøller skader ved å røre borti, men kan ikke angripe
//}

Roborudolf.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
    if (this.hp == 0) {
        this.fall();
        this.momentum = (20 * kraft) / 1.5;
        this.momentum_x = retning * kraft * 10;
    } else if (this.hp % 20 == 0) {
        this.immunitet = this.immunitet + 150;
    }
}

Enhet.registrer("roborudolf", Roborudolf);