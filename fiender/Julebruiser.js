Julebruiser = function(x, y) {
    this.type = "julebruiser";
    this.antall_farger = 0;
    Enhet.call(this, x, y);
    
    this.sett_bilde("angrip-venstre", "av.png");
    this.sett_bilde("angrip-høyre", "ah.png");
    
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
            this.velg_bilde("gå-venstre");
            break;
        case 1:
            this.velg_bilde("gå-høyre");
            break;
        case 0:
            this.velg_bilde("stopp");
    }
}

Julebruiser.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    var skade = false;
    switch (this.retning) {
        case -1:
            skade = Spill.brett.skad(this, this.x - this.rekkevidde, this.y, this.x, this.y + this.hoyde, 1, -1, 1);
            break;
        case 1:
            skade = Spill.brett.skad(this, this.x + this.rekkevidde, this.y, this.x + 2 * this.rekkevidde, this.y + this.hoyde, 1, 1, 1);
            break;
        case 0:
        default:
            skade = Spill.brett.skad(this, this.x - this.rekkevidde / 2, this.y, this.x + this.rekkevidde / 2, this.y + this.hoyde, 1, -1, 1);
            skade = Spill.brett.skad(this, this.x + this.rekkevidde / 2, this.y, this.x + this.rekkevidde * 1.5, this.y + this.hoyde, 1, 1, 1);
            break;
    }
    if (skade) {
        Lyd.Effekt.spill("lyd/julebruiser-slag.mp3");
    }
}

Julebruiser.prototype.aktiver = function() {
    Enhet.prototype.aktiver.call(this);
    this.hent_element();
    this.velg_bilde("stopp");
}

Julebruiser.prototype.angrip = function() {
    Enhet.prototype.angrip.call(this);
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