Seigeninja = function(x, y) {
    this.farge = Math.floor(Math.random()*4);
    Enhet.call(this, "bilder/seigeninja"+this.farge+".png", x, y);
    
    this.type = "seigeninja";
    this.bredde = 32;
    this.hoyde = 32;
    this.hastighet = 10;
    this.hoppstyrke = 25;
    this.original_retning = 1;
    this.maxhp = 3;
    this.rekkevidde = 32;
    
    this.sett_kontroll(Kontroll.hent("seigeninja"));
}

Seigeninja.prototype = Object.create(Enhet.prototype);
Seigeninja.prototype.constructor = Seigeninja

Seigeninja.prototype.angrep_tick = function() {
    Enhet.prototype.angrep_tick.call(this);
    switch (this.retning) {
        case -1:
            Spill.brett.skad(this, this.x - this.rekkevidde, this.y, this.punkt_x(), this.y + this.hoyde, 1, -1, 1);
            break;
        case 1:
            Spill.brett.skad(this, this.punkt_x(), this.y, this.x + 2 * this.rekkevidde, this.y + this.hoyde, 1, 1, 1);
            break;
        case 0:
        default:
            Spill.brett.skad(this, this.x - this.rekkevidde / 2, this.y, this.x + this.rekkevidde / 2, this.y + this.hoyde, 1, -1, 1);
            Spill.brett.skad(this, this.x + this.rekkevidde / 2, this.y, this.x + this.rekkevidde * 1.5, this.y + this.hoyde, 1, 1, 1);
            break;
    }
}

Seigeninja.prototype.skade = function(skade, retning, kraft) {
    if (this.immunitet > 0) return;
    this.fall();
    this.momentum = (20 * kraft) / 1.5;
    this.momentum_x = retning * kraft * 10;
    Enhet.prototype.skade.call(this, skade, retning, kraft);
}