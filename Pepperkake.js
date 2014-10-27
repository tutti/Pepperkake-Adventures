Pepperkake = function(x, y) {
    this.type = "pepperkake";
    this.antall_farger = 1;
    Enhet.call(this, x, y);
    
    this.hastighet = 8;
    this.hoppstyrke = 20;
    this.status = "normal";
    this.bredde = 32;
    this.hoyde = 32;
    this.maxhp = 3;
    this.original_retning = 0;
    
    this.sett_kontroll(Kontroll.hent("pepperkake"));
    
    this.sett_bilde("angrip-venstre", "av.png");
    this.sett_bilde("angrip-høyre", "ah.png");
    this.sett_bilde("angrip-luft-venstre", "lav.png");
    this.sett_bilde("angrip-luft-høyre", "lah.png");
}

Pepperkake.prototype = Object.create(Enhet.prototype);
Pepperkake.prototype.constructor = Pepperkake

Pepperkake.prototype.sett_retning = function(retning) {
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
            break;
    }
}

Pepperkake.prototype.tick = function() {
    Enhet.prototype.tick.call(this);
    if (this.status == "luft") {
        this.kontroll.styr(this);
    }
}

Pepperkake.prototype.angrep_tick = function() {
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

Pepperkake.prototype.hopp = function() {
    Enhet.prototype.hopp.call(this);
    Lyd.Effekt.spill("lyd/Hopp2.mp3");
}

Pepperkake.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.retning = 0;
    this.momentum = (this.hoppstyrke * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}

Pepperkake.prototype.dod = function() {
    Enhet.prototype.dod.call(this);
    Lyd.Effekt.spill("lyd/Tap.mp3");
}

Enhet.registrer("pepperkake", Pepperkake);